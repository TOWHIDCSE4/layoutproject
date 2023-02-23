import React from "react";
import { Form, Input, Row, Col,Upload } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import { InboxOutlined } from "@ant-design/icons";
import _ from "lodash";
import UploadMultilField from "../../Upload";
const { Dragger } = Upload;
const UserInformationForm = ({ form }: { form: any; }) => {
  const { t } = useBaseHook();
  const handleFileChange = async (files) => {
    const info = files[0]
    form?.setFieldsValue({ 'avatar': info });
  }

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
					<Input
						type="date"
						placeholder={t("pages:users.form.birthday")}
					/>
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
					<Input placeholder={t("pages:users.form.gender")} />
				</Form.Item>
			</Col>

			<Col md={12}>
				<Form.Item
					label={t("pages:users.form.commuteMethod")}
					name="commuteMethod"
					rules={[
						{
							required: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.commuteMethod"),
							}),
						},
						{
							whitespace: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.commuteMethod"),
							}),
						},
						{
							max: 255,
							message: t("messages:form.maxLength", {
								name: t("pages:users.form.commuteMethod"),
								length: 255,
							}),
						},
					]}
				>
					<Input placeholder={t("pages:users.form.commuteMethod")} />
				</Form.Item>
			</Col>

			<Col md={12}>
				<Form.Item
					label={t("pages:users.form.marriedStatus")}
					name="marriedStatus"
					rules={[
						{
							required: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.marriedStatus"),
							}),
						},
						{
							whitespace: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.marriedStatus"),
							}),
						},
						{
							max: 255,
							message: t("messages:form.maxLength", {
								name: t("pages:users.form.marriedStatus"),
								length: 255,
							}),
						},
					]}
				>
					<Input placeholder={t("pages:users.form.marriedStatus")} />
				</Form.Item>
			</Col>

			<Col md={24}>
				<Form.Item label={t("pages:users.form.avatar")} name="avatar">
					<Dragger
						className="ant-upload-drag-icon"
						// multiple={false}
						name="avatar"
					>
						<UploadMultilField
							listType="picture-card"
							isImg={true}
							multiple={false}
							onChange={handleFileChange}
						>
							<InboxOutlined />
						</UploadMultilField>
					</Dragger>
				</Form.Item>
			</Col>
		</Row>
  );
};

export default UserInformationForm;