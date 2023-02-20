import BaseController from "./BaseController";
import UserTempModel from "@root/server/app/Models/UserTempModel";
import RoleModel from "@app/Models/RoleModel";
import ApiException from "@app/Exceptions/ApiException";
import { removeVietnameseTones, hashNumber, makeKey } from "@helpers/utils";
import TenantsModel from "@app/Models/TenantsModel";
import Logger from "@core/Logger";
import redis from "../Services/Redis";
import Auth from "@root/server/libs/Auth";
import authConfig from "@config/auth";
import MailService from "@root/server/app/Services/Mail";
import UserModel from "@app/Models/UserModel";
import Storage from '@app/Services/Storage';
import storage from "@config/storage";
import moment from 'moment-timezone';

const logger = Logger("UserTemp");

export default class AdminController extends BaseController {
  Model: typeof UserTempModel = UserTempModel;
  RoleModel: any = RoleModel;
  TenantsModel: any = TenantsModel;
  UserModel: any = UserModel;

  async index() {
    const { auth } = this.request;
    let inputs = this.request.all();
    let project = [
      "user_temps.username",
      "user_temps.email",
      "user_temps.roleId",
      "user_temps.id",
      "tenants.name as tenantName",
      "roles.name as roleName",
      "user_temps.createdAt",
      "ag.username as agUsername",
    ];

    let role = await this.RoleModel.getById(auth.roleId);
    let query = this.Model.query()
      .leftJoin("user_temps as ag", "user_temps.createdBy", "ag.id")
      .leftJoin("roles", "user_temps.roleId", "roles.id")
      .leftJoin("tenants", "user_temps.tenantId", "tenants.id")
      .whereNot("user_temps.id", auth.id);

    let result = await query.select(project).getForGridTable(inputs);
    return result;
  }

  async detail() {
    const { auth } = this.request;
    const allowFields = {
      id: "string!",
    };
    let inputs = this.request.all();
    let userTemp = await this.Model.query().where("id", auth.id).first();
    logger.info(`View Detail [usernameView:${userTemp.username}] `);
    let params = this.validate(inputs, allowFields, {
      removeNotAllow: true,
    });
    let result = await this.Model.getOne({ code: params.id });
    if (!result) {
      logger.error(`Critical:Show detail user ERR: user doesn't exist!`);
      throw new ApiException(6000, "user doesn't exist!");
    }
    logger.info(
      `Show detail user [usernameView:${userTemp.username
      },username:${JSON.stringify(result)}] `
    );
    return result;
  }

  makeUserTempLink(user) {
    let token = Auth.generateJWT(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      {
        key: authConfig["SECRET_KEY"],
        expiresIn: authConfig["JWT_EXPIRE_UPDATE_USER_INFO"],
      }
    );
    redis.set(
      `UserTemp:${user.id}`,
      `${token}`,
      "EX",
      authConfig["JWT_EXPIRE_UPDATE_USER_INFO"]
    );
    return `${this.request.get("origin")}/user-temp/${token}`;
  }

  async store() {
    const { auth } = this.request;
    let inputs = this.request.all();
    let userInfo = {
      ...inputs
    }
    let usernameExist = await this.Model.findExist(inputs.username, "username");
    if (usernameExist) throw new ApiException(6007, "Username already exists!");

    let emailExist = await this.Model.findExist(inputs.email, "email");
    if (emailExist) throw new ApiException(6021, "Email already exists!");

    let role = await this.RoleModel.getById(inputs.roleId);
    if (!role) throw new ApiException(6000, "User role not exists!");

    if (inputs["password"]) inputs["password"] = await this.Model.hash(inputs["password"]);

    let params = {
      ...inputs,
      createdBy: auth.id,
    };
    let result = await this.Model.insertOne(params);

    delete result["password"];

    //sent email
    let variables = {
      userTempLink: this.makeUserTempLink(result),
      email: result.email,
    };

    let subject = "KDDI — Create new user information";
    let content = `<div style="width: 100%;
      height: 400px;
      text-align: center;
      color: rgb(255, 255, 255);
      padding: 3px;
      font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #364574;
      ">
  <h1>Application-Platform</h1>
  <div style="
          max-width: 840px;
          height: 280px;
          text-align: center;
          background-color: #fff;
          border: solid 1px rgb(218, 218, 218);
          color: #364574;
          padding: 5px;
          margin: auto;">
    <h2>Create new user information</h2>
    <br />
   <div style="text-align:left;padding: 5px;"> 
    Welcome ${userInfo.email} ,your account has been created.Please click this link and enter your information to active your account.<br />  
    <a href="${variables.userTempLink}">click this link</a> <br/>
    After submit successfully, please use your email and given password to login the system <br/>
    <h3 style="font-weight: bold"> Your password: ${userInfo.password}</h3><br/> 
    <h3 style="font-weight: bold">*Important: Please change your password after login successfully </h3> <br/>
    Best regards
    </div>
  </div>
</div>`;

    MailService.send(variables.email, subject, content, variables);

    return result;
  }

  async update() {
    let inputs = this.request.all();
    const { auth } = this.request;
    const allowFields = {
      id: "number!",
      email: "string!",
    };
    let userTemp = await this.Model.getById(auth.id);
    logger.info(`Update user [username:${userTemp.username}] `);
    let params = this.validate(inputs, allowFields, {
      removeNotAllow: true,
    });
    const { id } = params;
    delete params.id;

    let exist = await this.Model.getById(id);
    if (!exist) {
      throw new ApiException(6006, "User doesn't exists!");
    }

    let emailExist = await this.Model.getOne({ email: params.email });
    if (emailExist && emailExist.id !== exist.id) {
      throw new ApiException(6021, "Email already exists!");
    }

    let dataUpdate = {
      ...params,
    };

    let result = await this.Model.updateOne(id, { ...dataUpdate });
    delete result["password"];
    return {
      result,
      old: exist,
    };
  }

  async updateUserTemp() {
    let data = this.request.all();
    const allowFields = {
      token: "string!",
      firstName: "string!",
      lastName: "string!",
      phone: "string!",
      birthday: "date!"
    }
    let params = this.validate(data, allowFields, { removeNotAllow: true });
    let { token } = params
    delete params.token

    let user = await Auth.decodeJWT(token, {
      key: authConfig["SECRET_KEY"],
    });

    let userTemp = await this.Model.getById(user.id);
    if (!userTemp) throw new ApiException(6000, "User doesn't exist!");

    let tenant = await this.TenantsModel.query().findById(userTemp.tenantId);
    if (!tenant) throw new ApiException(6028, "Tenant doesn't exist!");

    let userExist = await this.UserModel.query().where({ email: userTemp.email }).first();
    if (userExist) throw new ApiException(6050, "User already existed!");

    let twofaKey = makeKey(32);

    do {
      twofaKey = makeKey(32);
    } while (!!(await UserModel.getOne({ twofaKey: twofaKey })));

    let { files } = this.request;
    let emailIndex = userTemp.email.indexOf('@');
    let emailName = userTemp.email.substring(0, emailIndex);

    let directory = storage.FILE_PATH + `/avatar/${tenant ? removeVietnameseTones(tenant.name) : 'default'}/${removeVietnameseTones(emailName)}`;
    let fieldnameFile = []

    for (let file of files) {
      let nameTolower = file.originalname.split('.')
      nameTolower[nameTolower.length - 1] = nameTolower[nameTolower.length - 1].toLowerCase()
      let nameOldLowerCase = String(moment().unix()) + nameTolower.join('.')
      fieldnameFile.push({
        link: `${directory}/${nameOldLowerCase}`.replace('./public', ''),
      })
      try {
        Storage.saveToDisk({
          directory,
          data: file,
          fileName: nameOldLowerCase,
          overwrite: true,
          size: 5242880, //5mb
          type: ['image/png', 'image/jpg', 'image/jpeg']
        })
      } catch (uploadErr) {
        throw new ApiException(uploadErr.code, uploadErr.message)
      }
    }

    params = {
      ...params,
      twofaKey,
      isFirst: 1,
      username: userTemp.username, //remember to remove this in the future
      email: userTemp.email,
      roleId: userTemp.roleId,
      tenantId: userTemp.tenantId,
      password: userTemp.password,
      createdBy: userTemp.createdBy,
      image: fieldnameFile.length ? fieldnameFile[0].link : null
    }

    let result = await UserModel.insertOne(params);
    logger.info(
      `Create user [username:${user.username},userCreted:${JSON.stringify(
        result
      )}] `
    );
    let code = hashNumber(String(result.id));
    let resultUpdate = await UserModel.updateOne(result.id, { code: code });

    delete resultUpdate["password"];
    delete resultUpdate["twofaKey"];
    delete resultUpdate["isFirst"];
    delete resultUpdate["twofa"];
    return resultUpdate;
  }

  async destroy() {
    const { auth } = this.request;
    let params = this.request.all();
    let id = params.id;
    if (!id) throw new ApiException(9996, "ID is required!");

    let exist = await this.Model.getById(id);
    if (!exist) { throw new ApiException(6006, "User doesn't exists!"); }
    if ([id].includes(auth.id))
      throw new ApiException(6022, "You can not remove your account.");

    let user = await this.Model.query().where("id", params.id).first();
    await user.$query().delete();
    let userAuth = await this.Model.getById(auth.id);
    logger.info(
      `Destroy user [username:${userAuth.username},userDelete:${JSON.stringify(
        user
      )}] `
    );
    return {
      message: `Delete successfully`,
      old: user,
    };
  }

  async delete() {
    const { auth } = this.request;
    const allowFields = {
      ids: ["number!"],
    };
    const inputs = this.request.all();
    let params = this.validate(inputs, allowFields);

    let exist = await this.Model.query().whereIn("id", params.ids);
    if (!exist || exist.length !== params.ids.length) { throw new ApiException(6006, "User doesn't exists!"); }
    if (params.ids.includes(auth.id)) {
      logger.error(
        `Critical:User delete ERR: You can not remove your account!`
      );
      throw new ApiException(6022, "You can not remove your account.");
    }

    let users = await this.Model.query().whereIn("id", params.ids);
    for (let user of users) {
      await user.$query().delete();
    }
    let userAuth = await this.Model.getById(auth.id);
    logger.info(
      `Delete user [username:${userAuth.username
      },listUserDelete:${JSON.stringify(users)}] `
    );
    return {
      old: {
        usernames: (users || []).map((user) => user.username).join(", "),
      },
    };
  }
}