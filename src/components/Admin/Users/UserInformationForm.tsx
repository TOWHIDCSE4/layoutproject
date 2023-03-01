import React from "react";
import { Form, Input, Row, Col,Upload, Select } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import { InboxOutlined } from "@ant-design/icons";
import _ from "lodash";
import UploadMultilField from "../../Upload";
import ValidatorHook from "@root/src/hooks/ValidatorHook"
import DragUploadMultilField from "../../DragUpload";
const { Dragger } = Upload;
const {limitSizeImageSP, limitSizeImage, extensionImage} = ValidatorHook()
const UserInformationForm = ({ form }: { form: any; }) => {
  const { t } = useBaseHook();
  const handleFileChange = async (files) => {
    const info = files[0]
    form?.setFieldsValue({ 'avatar': info });
  }
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  return (
    <Row gutter={[24, 0]}>

      <Col md={12}>
        <Form.Item
          label={t("pages:users.form.lastName")}
          name="lastName"
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.lastName"),
              }),
            },
            {
              whitespace: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.lastName"),
              }),
            },
            {
              max: 255,
              message: t("messages:form.maxLength", {
                name: t("pages:users.form.lastName"),
                length: 255,
              }),
            },
          ]}
        >
          <Input placeholder={t("pages:users.form.lastName")} />
        </Form.Item>
      </Col>

      <Col md={12}>
        <Form.Item
          label={t("pages:users.form.firstName")}
          name="firstName"
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.firstName"),
              }),
            },
            {
              whitespace: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.firstName"),
              }),
            },
            {
              max: 255,
              message: t("messages:form.maxLength", {
                name: t("pages:users.form.firstName"),
                length: 255,
              }),
            },
          ]}
        >
          <Input placeholder={t("pages:users.form.firstName")} />
        </Form.Item>
      </Col>

      <Col md={12}>
        <Form.Item
          label={t("pages:users.form.phone")}
          name="phone"
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.phone"),
              }),
            },
            {
              whitespace: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.phone"),
              }),
            },
            {
              max: 255,
              message: t("messages:form.maxLength", {
                name: t("pages:users.form.phone"),
                length: 255,
              }),
            },
          ]}
        >
          <Input placeholder={t("pages:users.form.phone")} />
        </Form.Item>
      </Col>

      <Col md={12}>
        <Form.Item
          label={t("pages:users.form.birthday")}
          name="birthday"
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.birthday"),
              }),
            },
            {
              whitespace: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.birthday"),
              }),
            },
            {
              max: 255,
              message: t("messages:form.maxLength", {
                name: t("pages:users.form.birthday"),
                length: 255,
              }),
            },
          ]}
        >
          <Input type="date" placeholder={t("pages:users.form.birthday")} />
        </Form.Item>
      </Col>
      <Col md={12}>
        <Form.Item
          label={t("pages:users.form.gender")}
          name="gender"
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.gender"),
              }),
            },
            {
              whitespace: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.gender"),
              }),
            },
            {
              max: 255,
              message: t("messages:form.maxLength", {
                name: t("pages:users.form.gender"),
                length: 255,
              }),
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select a gender"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: 'male',
                label: 'Male',
              },
              {
                value: 'female',
                label: 'Female',
              },

            ]}
          />
        </Form.Item>
      </Col>
      <Col md={12}>
        <Form.Item
          label={t("pages:users.form.method")}
          name="method"
         
        >
        <Input type="text" placeholder={t("pages:users.form.method")} />

        </Form.Item>
      </Col>
      <Col md={24}>
        <Form.Item
          label={t("pages:users.form.marital")}
          name="marital"
         
        >
        <Input type="text" placeholder={t("pages:users.form.marital")} />

        </Form.Item>
      </Col>
      <Col md={24}>
        {/* <Dragger className="ant-upload-drag-icon"
          // multiple={false}
          name="avatar">
          <p>{t("pages:users.form.avatar")}</p>
          <UploadMultilField listType="picture-card" isImg={true}
            multiple={false} onChange={handleFileChange}>
            <InboxOutlined />
          </UploadMultilField>
        </Dragger> */}
        <Form.Item
          label={t("pages:users.form.avatar")}
          name="avatar"  
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t("pages:users.form.avatar"),
              }),
            },
            limitSizeImage("File size must be less than 5MB", 5),
            extensionImage("Required image file (png/jpg/jpeg)")
            
          ]}
        >
        <DragUploadMultilField listType="picture-card" isImg={true}
            multiple={false} onChange={handleFileChange}>
        <InboxOutlined />
        </DragUploadMultilField>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default UserInformationForm;