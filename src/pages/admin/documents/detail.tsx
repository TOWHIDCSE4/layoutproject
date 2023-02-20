import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button, Form, Spin, Card, Row, Col } from "antd";
import documentService from "@src/services/documentService";
import to from "await-to-js";
import useBaseHook from "@src/hooks/BaseHook";
import {
  LeftCircleFilled,
  SaveFilled,
  ExclamationCircleOutlined,
  SnippetsOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import usePermissionHook from "@src/hooks/PermissionHook";
import DetailForm from "@root/src/components/Admin/Application/Detail/DetailForm";
import ApplicationSubmitDetal from "@root/src/components/Admin/Application/Detail/ApplicationSubmitDetal";
import moment from "moment-timezone";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { confirmDialog } from "@src/helpers/dialogs";
import DocumentTemplate from "@src/config/DocumentTemplate";
import useTableFormHook from "@root/src/hooks/TableFormHook";
import auth from '@src/helpers/auth'

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const Detail = () => {
  const { t, notify, redirect, router } = useBaseHook();
  const [documentTemplate, setDocumentTemplate]: any[] = useState();
  const [document, setDocument]: any = useState();
  const [form] = Form.useForm();
  const { checkPermission } = usePermissionHook();
  const { query } = router;
  const [loadingApprove, setLoadingApprove] = useState(false);
  const { TableForm } = useTableFormHook();

  const updatePer = checkPermission({
    documents: "U",
  });

  const ApproviceAMPer = checkPermission({
    documents_Approval_reject_ad: "A",
  });
  const ApproviceEMPer = checkPermission({
    documents_Approval_reject_em: "A",
  });


  const fetchData = async () => {
    let idError: any = null;
    if (!query.id) {
      idError = {
        code: 9996,
        message: "missing ID",
      };
    }
    if (idError) return notify(t(`errors:${idError.code}`), "", "error");
    let [documentError, documents]: [any, any] = await to(
      documentService().withAuth().detail({ id: query.id })
    );
    if (documentError)
      return notify(t(`errors:${documentError.code}`), "", "error");
    if (!documents.template) return notify(t(`errors:9996`), "", "error");
    let FieldDateForm = [];
    let FieldFileForm = [];
    let tableField = []

    if (documents?.template && documents.content) {
      if (documents?.template && documents.content) {
        documents?.template?.forEach((stepField: any) => {
          stepField.GroupDefinition.forEach((groupField: any) => {
            groupField.FieldDefinition.forEach((field: any) => {
              if (
                field.inputType == "dateTimeInput" ||
                field.inputType == "dateTimeShowTimeInput"
              ) {
                FieldDateForm.push(field.fieldName);
              }
              if (field.inputType == "fileInput") {
                FieldFileForm.push(field.fieldName);
              }
              if (field.inputType == "tableInput") {
                tableField.push(field.fieldName);
              }
            });
          });
        });

        FieldDateForm.forEach((item: any) => {
          if (documents?.content[item]) {
            documents.content[item] = moment(documents?.content[item]);
          }
        });
        FieldFileForm.forEach((item: any) => {
          documents.content[item] = documents?.content[item]?.map(
            (file: any, index: number) => {
              let name = String(file)?.split("/") || [];
              return {
                uid: `${index}`,
                name: name[name.length - 1],
                status: "done",
                url: publicRuntimeConfig.DOMAIN + file,
              };
            }
          );
        });
        tableField.forEach((item: any) => {
          TableForm.setData({ nameTable: item, newData: documents?.content[item] })
        })
      }
    }
    setDocumentTemplate(documents?.template || []);
    setDocument(documents);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onApprove = async (): Promise<void> => {
    const [errorField, values] = await to(form.validateFields());
    if (errorField) {
      return;
    }
    let dataApprove = {
      id: document.code,
      comment_Your_Comments_Basic: values.comment_Your_Comments_Basic,
      comment_Tenant_Admin_Comments_Basic:
        values.comment_Tenant_Admin_Comments_Basic,
      comment_Issuer_Comments_Basic: values.comment_Issuer_Comments_Basic,
    };
    setLoadingApprove(true);
    let [error, result]: any[] = await to(
      documentService().withAuth().approve(dataApprove)
    );
    setLoadingApprove(false);
    if (error) return notify(t(`errors:${error.code}`), "", "error");

    notify(t("messages:message.recordDocumentApproved"));
    redirect("frontend.admin.documents.index");
    return result;
  };

  const onReject = async (): Promise<void> => {
    const [errorField, values] = await to(form.validateFields());
    if (errorField) {
      return;
    }
    let dataReject = {
      id: document.code,
      comment_Your_Comments_Basic: values.comment_Your_Comments_Basic,
      comment_Tenant_Admin_Comments_Basic:
        values.comment_Tenant_Admin_Comments_Basic,
      comment_Issuer_Comments_Basic: values.comment_Issuer_Comments_Basic,
    };
    setLoadingApprove(true);
    let [error, result]: any[] = await to(
      documentService().withAuth().reject(dataReject)
    );
    setLoadingApprove(false);
    if (error) return notify(t(`errors:${error.code}`), "", "error");

    notify(t("messages:message.recordDocumentRejected"));
    redirect("frontend.admin.documents.index");
    return result;
  };

  const onSaveAndSubmit = async (data: any): Promise<any> => {
    let {
      comment_Your_Comments_Basic,
      comment_Tenant_Admin_Comments_Basic,
      comment_Issuer_Comments_Basic,
      ...values
    } = data;

    let dataContent = documentTemplate || [];
    let FieldDateForm = [];
    let FieldFileForm = [];

    dataContent.forEach((stepField: any) => {
      stepField.GroupDefinition.forEach((groupField: any) => {
        groupField.FieldDefinition.forEach((field: any) => {
          if (
            field.inputType == "dateTimeInput" ||
            field.inputType == "dateTimeShowTimeInput"
          ) {
            FieldDateForm.push(field.fieldName);
          }
          if (field.inputType == "fileInput") {
            FieldFileForm.push(field.fieldName);
          }
        });
      });
    });

    FieldDateForm.forEach((item: any) => {
      if (values[item]) {
        values[item] = moment(values[item]).format("YYYY-MM-DD");
      }
    });
    FieldFileForm.forEach((item: any) => {
      delete values[item]?.file;
    });

    setLoadingApprove(true);
    let [error, result]: any[] = await to(
      documentService()
        .withAuth()
        .edit({
          id: document.id,
          statusDocumentTemplate: 2,
          ...values,
        })
    );

    setLoadingApprove(false);
    if (error) return notify(t(`errors:${error.code}`), "", "error");

    notify(t("messages:message.recordDocumentUpdated"));
    redirect("frontend.admin.documents.index");
    return result;
  };

  if (!document || !documentTemplate)
    return (
      <div className="content">
        <Spin />
      </div>
    );
  return (
    <div className="content">
      <Card title={document?.name?.toUpperCase()}>
        <Form
          form={form}
          name="DetailApplication"
          layout="vertical"
          initialValues={{
            ...document.content,
            comment_Your_Comments_Basic:
              document?.others?.comment_Your_Comments_Basic,
            comment_Tenant_Admin_Comments_Basic:
              document?.others?.comment_Tenant_Admin_Comments_Basic,
            comment_Issuer_Comments_Basic:
              document?.others?.comment_Issuer_Comments_Basic,
          }}
          scrollToFirstError
          onFinish={(value) => {
            confirmDialog({
              title: "There's no going back",
              icon: <CheckCircleOutlined style={{ color: "green" }} />,
              content: "Do you really want to submit?",
              onOk: () => onSaveAndSubmit(value),
              okText: t("buttons:confirm"),
            });
          }}
        >
          <DetailForm documentTempale={documentTemplate} form={form} />
          <br />
          <br />
          <ApplicationSubmitDetal disabled={{ 1: false, 2: false, 3: false }} />
          <br />
          <Form.Item wrapperCol={{ span: 24 }} className="text-center">
            <Button onClick={() => router.back()} className="btn-margin-right">
              <LeftCircleFilled /> {t("buttons:back")}
            </Button>
            {document.status == 4 && document.createdBy == auth().user.id &&(
              <Button
                hidden={!updatePer}
                type="primary"
                htmlType="submit"
                className="btn-margin-right"
                loading={loadingApprove}
              >
                <SaveFilled /> {t("buttons:SaveAndExit")}
              </Button>
            )}
            {document?.others?.statusDocumentTemplate != DocumentTemplate.stateForm.length - 1 &&
            (document.others.statusDocumentTemplate == DocumentTemplate.stateForm.length - 2 || document.others.statusDocumentTemplate == DocumentTemplate.stateForm.length - 3)  &&
            (
              <>
                <Button
                  hidden={!ApproviceAMPer && !ApproviceEMPer}
                  className="btn-margin-right"
                  loading={loadingApprove}
                  type="primary"
                  onClick={() => {
                    confirmDialog({
                      title: "There's no going back",
                      icon: <CheckCircleOutlined style={{ color: "green" }} />,
                      content:
                        "Once you approve, you cannot change your decision",
                      onOk: () => onApprove(),
                      okText: t("buttons:confirm"),
                    });
                  }}
                >
                  {t("buttons:approve")}
                </Button>
                <Button
                  hidden={!ApproviceAMPer && !ApproviceEMPer}
                  className="btn-margin-right"
                  loading={loadingApprove}
                  type="primary"
                  danger
                  onClick={() => {
                    confirmDialog({
                      title: "There's no going back",
                      icon: (
                        <ExclamationCircleOutlined style={{ color: "red" }} />
                      ),
                      content:
                        "Once you reject, you cannot change your decision",
                      onOk: () => onReject(),
                      okText: t("buttons:confirm"),
                      okButtonProps: { danger: true },
                    });
                  }}
                >
                  {t("buttons:reject")}
                </Button>
              </>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

Detail.Layout = (props) => {
  const { t } = useBaseHook();
  return <Layout title={" "} description={" "} {...props} />;
};

Detail.permissions = {
  documents: "R",
};

export default Detail;
