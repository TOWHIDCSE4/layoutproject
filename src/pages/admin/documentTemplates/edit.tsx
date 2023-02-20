import React, { useEffect, useState } from "react";
import to from "await-to-js";
import dynamic from "next/dynamic";
import { Button, Form, Col, Row, Input, Space, Select, Spin } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import StepDefinition from "@root/src/components/Admin/documentTemplates/StepDefinition";
import documentTemplateService from "@src/services/documentTemplateService";
import { SendOutlined, LeftCircleFilled } from "@ant-design/icons";
const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const languageTypes = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "Vietnamese",
    value: "vi",
  },
];

const Edit = () => {
  const [loading, setLoading] = useState(false);
  const { t, notify, redirect, router } = useBaseHook();
  const [form] = Form.useForm();
  const [documentTemplate, setDocumentTemplate]: any = useState();
  const { query } = router;

  const fetchData = async () => {
    let idError: any = null;

    if (!query.id) {
      idError = {
        code: 9996,
        message: "missing ID",
      };
    }
    if (idError) return notify(t(`errors:${idError.code}`), "", "error");
    let [documentError, document]: [any, any] = await to(
      documentTemplateService().withAuth().detail({ id: query.id })
    );
    if (documentError)
      return notify(t(`errors:${documentError.code}`), "", "error");
    let dataRevect = {
      code: document.code,
      name: document.name,
      locale: document.locale,
      createDocumentTemplates: document.content,
    };
    setDocumentTemplate(dataRevect);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitForm = async (values: any) => {
    let check = false;
    check =
      !values ||
      !values.createDocumentTemplates ||
      (Array.isArray(values.createDocumentTemplates) &&
        !values.createDocumentTemplates.length);
    if (
      values &&
      values.createDocumentTemplates &&
      Array.isArray(values.createDocumentTemplates) &&
      values.createDocumentTemplates.length
    ) {
      values.createDocumentTemplates.map((element: any) => {
        check = !element.GroupDefinition || !element.GroupDefinition.length;
        if (element.GroupDefinition && element.GroupDefinition.length) {
          element.GroupDefinition.map((elementGroup: any) => {
            check =
              !elementGroup.FieldDefinition ||
              !elementGroup.FieldDefinition.length;
          });
        }
      });
    }

    if (check) {
      return notify("Missing form creation information", "", "error");
    }

    values = {
      id: documentTemplate.code,
      ...values,
    };

    setLoading(true);
    let [error, result]: any[] = await to(
      documentTemplateService().withAuth().edit(values)
    );
    setLoading(false);

    if (error) return notify(t(`errors:${error.code}`), "", "error");

    notify(t("messages:message.recordDocumentTemplatesUpdated"));
    redirect("frontend.admin.documents.index");
  };

  if (!documentTemplate)
    return (
      <div className="content">
        <Spin />
      </div>
    );
  return (
    <div className="content">
      <Form
        form={form}
        onFinish={submitForm}
        name="EditTemplates"
        initialValues={{ ...documentTemplate }}
        scrollToFirstError
      >
        <Row gutter={[32, 0]}>
          <Col span={12}>
            <Form.Item
              labelAlign={"right"}
              name={["name"]}
              label={t(
                "pages:documentTemplates.create.fieldInformation.templatesName"
              )}
              rules={[
                {
                  required: true,
                  message: t("messages:form.required", {
                    name: t(
                      "pages:documentTemplates.create.fieldInformation.templatesName"
                    ),
                  }),
                },
              ]}
            >
              <Input
                placeholder={t(
                  "pages:documentTemplates.create.fieldInformation.templatesName"
                )}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelAlign={"right"}
              name={["locale"]}
              label={t(
                "pages:documentTemplates.create.fieldInformation.language"
              )}
              rules={[
                {
                  required: true,
                  message: t("messages:form.required", {
                    name: t(
                      "pages:documentTemplates.create.fieldInformation.language"
                    ),
                  }),
                },
              ]}
            >
              <Select
                placeholder={t(
                  "pages:documentTemplates.create.fieldInformation.language"
                )}
                style={{ width: "100%" }}
              >
                {languageTypes.map((dataLang, index) => (
                  <Select.Option key={index} value={dataLang.value}>
                    {dataLang.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <StepDefinition formValue={form} />
        <div style={{ textAlign: "center" }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={loading}
            >
              Submit
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

Edit.Layout = (props) => {
  const { t } = useBaseHook();
  return (
    <Layout
      title={t("pages:documentTemplates.edit.title")}
      description={t("pages:documentTemplates.edit.description")}
      {...props}
    />
  );
};

Edit.permissions = {
  document_templates: "U",
};

export default Edit;
