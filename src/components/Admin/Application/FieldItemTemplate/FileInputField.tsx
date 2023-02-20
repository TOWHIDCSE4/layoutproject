import useBaseHooks from "@root/src/hooks/BaseHook";
import { Upload, Form } from "antd";
const { Dragger } = Upload;
import { InboxOutlined } from "@ant-design/icons";
import { validations } from "@src/config/ListVadidations";
import validatorHook from "@root/src/hooks/ValidatorHook";
const FileInputField = ({
  fieldGroup,
  form,
}: {
  fieldGroup: {
    label: string;
    fieldName: string;
    validations: string[];
  };
  form: any;
}) => {
  const { limitSizeImageSP } = validatorHook();

  const { t } = useBaseHooks();
  let listValidations =
    fieldGroup?.validations?.map((item) => {
      return validations({ name: fieldGroup.label, validation: item, t: t });
    }) || [];
  let defaultFileList = [];
  let dataForm = form.getFieldValue(fieldGroup.fieldName);
  if (Array.isArray(dataForm)) {
    defaultFileList = dataForm;
  } else if (
    typeof dataForm === "object" &&
    !Array.isArray(dataForm) &&
    dataForm !== null &&
    Array.isArray(dataForm.fileList) &&
    dataForm.fileList.length
  ) {
    defaultFileList = dataForm.fileList;
  }
  return (
    <Form.Item
      label={fieldGroup.label}
      name={fieldGroup.fieldName}
      rules={[
        ...listValidations,
        limitSizeImageSP("File size must be less than 10MB", 10),
      ]}
    >
      <Dragger
        multiple
        className="width-button"
        defaultFileList={defaultFileList}
      >
        <div>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{t("pages:upload.choose")}</p>
          <p className="ant-upload-hint">{t("pages:upload.description")}</p>
        </div>
      </Dragger>
    </Form.Item>
  );
};

export default FileInputField;
