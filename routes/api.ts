import Route from '@core/Routes'
const ExtendMiddleware = require("@app/Middlewares/ExtendMiddleware");
const AuthApiMiddleware = require('@app/Middlewares/AuthApiMiddleware');
import PermissionMiddleware from "@app/Middlewares/PermissionMiddleware"
const { permission, permissionResource, permissionMethod } = PermissionMiddleware

const multer = require('multer')
const upload = multer();

Route.group(() => {
  // ---------------------------------- Auth Routes ---------------------------------------//
  Route.post("/login", "AuthController.login").name('auth.login')
  Route.post("/forgotPassword", "AuthController.forgotPassword").name('auth.forgotPassword')
  Route.get("/checkToken/:token", "AuthController.checkToken").name('auth.checkToken')
  Route.post("/resetPassword", "AuthController.resetPassword").name('auth.resetPassword')

  // ---------------------------------- End Auth Routes -----------------------------------//

  // ---------------------------------- Route Routes ---------------------------------------//
  Route.get("/routes", "RouteController.index").name('routes.index')
  // ---------------------------------- End Route Routes -----------------------------------//

  // ---------------------------------- Route User Temp Update Routes -----------------------------------//
  Route.put("/userTemps/updateUserTemp", "UserTempController.updateUserTemp").name("userTemps.updateUserTemp").middleware([upload.any()])
  // ---------------------------------- End User Temp Update Routes -----------------------------------//

  Route.group(() => {
    Route.post("/changePassword", "AuthController.changePassword").name("auth.changePassword")
    Route.post("/logout", "AuthController.logout").name('auth.logout')
    Route.post("/auth/getPermissionBot", "AuthController.getPermissionBot").name('auth.getPermissionBot')
    Route.post("/refreshToken", "AuthController.refreshToken").name('auth.refreshToken')
    Route.post("/auth/getRoleBotUser", "AuthController.getRoleBotUser").name('auth.getRoleBotUser')
    Route.post("/AuthTwofa", "AuthController.AuthTwofa").name('auth.AuthTwofa')
    Route.post("/changeState2FA", "AuthController.changeState2FA").name('auth.changeState2FA')

    // ---------------------------------- Route Document Routes ---------------------------------------//
    Route.get("/documents/getDocument", "DocumentController.getDocument").name('documents.getDocument').middleware([
      permission({ 'documents': 'R' })
    ])
    Route.get("/documents/getDocumentDraff", "DocumentController.getDocumentDraff").name('documents.getDocumentDraff').middleware([
      permission({ 'documents': 'R' })
    ])


    Route.get("/documents", "DocumentController.index").name('documents.index').middleware([
      permission({ 'documents': 'R' })
    ])

    Route.post("/documents", "DocumentController.store").name('documents.store').middleware([upload.any(), permission({ 'documents': 'C' })])
    Route.get("/documents/:id", "DocumentController.detail").name('documents.detail').middleware([
      permission({ 'documents': 'R' })
    ])

    Route.put("/documents/:id", "DocumentController.update").name('documents.update').middleware([upload.any(), permission({ 'documents': 'U' })])
    Route.delete("/documents/:id", "DocumentController.destroy").name('documents.destroy').middleware([permissionResource(['documents'])])
    Route.delete("/documents", `DocumentController.delete`).name('delete').middleware([permission({ 'documents': 'D' })])
    Route.post("/documents/approve", "DocumentController.approve").name('documents.approve')
    Route.post("/documents/reject", "DocumentController.reject").name('documents.reject')



    // ---------------------------------- End Route Document Routes -----------------------------------//

    // ---------------------------------- Route DocumentTemplate Routes ---------------------------------------//
    Route.resource("/document_templates", "DocumentTemplateController").name('document_templates').middleware([permissionResource(['document_templates'])])
    // ---------------------------------- End Route Document Routes -----------------------------------//

    // ---------------------------------- Route Invoice Routes ---------------------------------------//
    Route.resource("/invoices", "InvoiceController").name('invoices')
    // ---------------------------------- End Route Invoice Routes -----------------------------------//
    
    // ---------------------------------- User Routes ---------------------------------------//
    Route.resource("/users", "UserController").name('users').middleware([
      permissionResource(['users'])
    ]) // CRUD
    Route.get("/users/generateOTP", "UserController.generateOTP").name('users.generateOTP').middleware([
      permission({ 'users': 'R' })
    ])
    Route.post("/users/submitOTP", "UserController.submitOTP").name('users.submitOTP')
    Route.get("/users/getInfo", "UserController.getInfo").name('users.getInfo').middleware([
      permission({ 'users': 'R' })
    ])
    // ---------------------------------- End User Routes -----------------------------------//

    // ---------------------------------- User Routes ---------------------------------------//
    Route.resource("/users", "UserController")
      .name("users")
      .middleware([permissionResource(["users"])]); // CRUD
    Route.get("/users/generateOTP", "UserController.generateOTP")
      .name("users.generateOTP")
      .middleware([permission({ users: "R" })]);
    Route.post("/users/submitOTP", "UserController.submitOTP").name(
      "users.submitOTP"
    );
    Route.get("/users/getInfo", "UserController.getInfo")
      .name("users.getInfo")
      .middleware([permission({ users: "R" })]);
    // ---------------------------------- End User Routes -----------------------------------//

    // ---------------------------------- User Temp Routes -----------------------------------//

    Route.resource("/userTemps", "UserTempController")
      .name("userTemps")
      .middleware([permissionResource(["users"])]); // CRUD

    // ---------------------------------- End User Routes -----------------------------------//

    // ---------------------------------- Role Permission Routes ---------------------------------------//
    Route.get(
      "/rolePermissions/getPermissionByTenantId",
      "RolePermissionController.getPermissionByTenantId"
    )
      .name("rolePermissions.getPermissionByTenantId")
      .middleware([permission({ roles: "R" })]);

    Route.get(
      "/rolePermissions/getPermissionByGroupId",
      "RolePermissionController.getPermissionByGroupId"
    )
      .name("rolePermissions.getPermissionByGroupId")
      .middleware([permission({ roles: "R" })]);
    // ---------------------------------- End Role Permission Routes -----------------------------------//
    // Route.resource("/settings", "SettingController").name('settings')

    // ---------------------------------- Role Group Permission Routes ---------------------------------//
    Route.put("/rolePermissions/update", "RolePermissionController.update")
      .name("rolePermissions.update")
      .middleware([permission({ adminDecentralization: "U" })]);
    // ---------------------------------- End Role Group Permission Routes -----------------------------//

    // ---------------------------------- Role Group Routes ---------------------------------------//
    Route.resource("/roles", "RoleController")
      .name("roles")
      .middleware([permissionResource(["roles"])]);
    Route.get("/roles/select2", "RoleController.select2")
      .name("roles.select2")
      .middleware([permission({ roles: "R" })]);
    // Route.get("/roles/selectParent", "RoleController.selectParent").name('roles.selectParent')
    // ---------------------------------- End Role Group Routes -----------------------------------//

    // ---------------------------------- Setting Routes ---------------------------------------//

    Route.resource("/settings", "SettingController").name("settings");

    // ---------------------------------- tenants Routes ---------------------------------------//

    Route.post("/tenants/active", "TenantController.activeTenants")
      .name("tenants.activeTenants")
      .middleware([permission({ tenants: "A" })]);
    Route.resource("/tenants", "TenantController")
      .name("tenants")
      .middleware([permissionResource(["tenants"])]);

    // ---------------------------------- End tenants Routes -----------------------------------//

    // ---------------------------------- End Routes -----------------------------------//
  }).middleware([AuthApiMiddleware])
}).middleware([ExtendMiddleware]).name('api').prefix("/api/v1")