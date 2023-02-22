import React, { useState } from "react";
import { Button, Form, Col, Row } from "antd";
import userTempsService from "@root/src/services/userTempService";
import useBaseHook from "@src/hooks/BaseHook";
import {SaveFilled } from "@ant-design/icons";
import UserInformationForm from "@root/src/components/Admin/Users/UserInformationForm";
import Layout from "@src/layouts/TempUserInfo";
import to from "await-to-js";

const CreateTemp = () => {
  const { t, notify, redirect, router } = useBaseHook();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { query } = router;
  const token = query.token;

  //submit form
  const onFinish = async (values: any): Promise<void> => {
    setLoading(true);
    let data = { ...values, token: token };
    let [error, result]: any[] = await to(
      userTempsService().updateUserTemp(data)
    );

    setLoading(false);
    if (error) return notify(t(`errors:${error.code}`), "", "error");

    notify(t("messages:message.recordUserCreated"));
    redirect("frontend.admin.login");
    return result;
  };

  const randompass = () => {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  return (
    <>
      <div className="content">
        {/* <div className="logo"></div> */}
        <div className="form-registration" id="registration">
          {/* <div className="content-form-login">
            <div className="sitename-title">Create a new account</div>
            <div className="sitename">
              Fill out the information to create a new account
            </div>
          </div> */}
          <Form
            form={form}
            name="createAdmin"
            layout="vertical"
            initialValues={{
              username: "",
              password: randompass(),
              email: "",
              groupId: undefined,
              tags: [],
            }}
            onFinish={onFinish}
            scrollToFirstError
          >
            <Row>
              <Col md={{ span: 24, offset: 0 }}>
                <UserInformationForm form={form} />
                <Form.Item  wrapperCol={{ span: 8, offset: 8 }} className="text-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="btn-margin-right"
                  >
                    <SaveFilled /> {t("buttons:submit")}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

CreateTemp.Layout = (props) => {
  const { t } = useBaseHook();
  return (
    <Layout
      title={t("pages:users.create.title")}
      description={t("pages:users.create.description")}
      {...props}
    />
  );
};

export default CreateTemp;

