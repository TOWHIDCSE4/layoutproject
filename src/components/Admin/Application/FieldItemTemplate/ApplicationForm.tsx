import useBaseHooks from "@root/src/hooks/BaseHook";
import { Card, Col, Row } from "antd";

import TextInputField from "@root/src/components/Admin/Application/FieldItemTemplate/TextInputField";
import NumberInputField from "@root/src/components/Admin/Application/FieldItemTemplate/NumberInputField";
import DateTimeInputField from "@root/src/components/Admin/Application/FieldItemTemplate/DateTimeInputField";
import SelectInputField from "@root/src/components/Admin/Application/FieldItemTemplate/SelectField";
import FileInputField from "@root/src/components/Admin/Application/FieldItemTemplate/FileInputField";
import TextAreaInputField from "@root/src/components/Admin/Application/FieldItemTemplate/TextAreaInputField";
import CheckboxField from "@root/src/components/Admin/Application/FieldItemTemplate/CheckboxField";
import RadioField from "@root/src/components/Admin/Application/FieldItemTemplate/RadioField";
import DateTimeshowTimeField from "@root/src/components/Admin/Application/FieldItemTemplate/DateTimeshowTimeField";
import TableField from "@root/src/components/Admin/Application/FieldItemTemplate/TableField";

const ApplicationForm = ({
  documentTempale = [],
  form,
  disabled = [],
}: {
  documentTempale: any[];
  form: any;
  disabled?: string[];
}) => {
  return (
    <>
      {documentTempale?.map((item, index) => {
        item.FieldDefinition = item.FieldDefinition?.sort(
          (a: any, b: any) => a.position - b.position
        );
        return (
          <div key={String(index) + String("Application")}>
            <Card key={index} title={item?.groupTitle}>
              <Row gutter={24}>
                {item?.FieldDefinition?.map((fieldGroup, index) => {
                  return (
                    <Col
                      key={String(index) + fieldGroup?.fieldName}
                      lg={fieldGroup?.col?.lg || 24}
                      md={fieldGroup?.col?.md || 24}
                      sm={fieldGroup?.col?.sm || 24}
                      xs={fieldGroup?.col?.xs || 24}
                    >
                      {fieldGroup.inputType === "textInput" ? (
                        <TextInputField fieldGroup={fieldGroup} />
                      ) : fieldGroup.inputType === "textAreaInput" ? (
                        <TextAreaInputField fieldGroup={fieldGroup} />
                      ) : fieldGroup.inputType === "numberInput" ? (
                        <NumberInputField fieldGroup={fieldGroup} />
                      ) : fieldGroup.inputType === "dateTimeInput" ? (
                        <DateTimeInputField
                          fieldGroup={fieldGroup}
                          form={form}
                        />
                      ) : fieldGroup.inputType === "dateTimeShowTimeInput" ? (
                        <DateTimeshowTimeField
                          fieldGroup={fieldGroup}
                          form={form}
                        />
                      ) : fieldGroup.inputType === "selectInput" ? (
                        <SelectInputField fieldGroup={fieldGroup} />
                      ) : fieldGroup.inputType === "fileInput" ? (
                        <FileInputField fieldGroup={fieldGroup} form={form} />
                      ) : fieldGroup.inputType === "checkboxInput" ? (
                        <CheckboxField fieldGroup={fieldGroup} />
                      ) : fieldGroup.inputType === "radioInput" ? (
                        <RadioField fieldGroup={fieldGroup} />
                      ) : fieldGroup.inputType === "tableInput" ? (
                        <TableField disabled={disabled} fieldGroup={fieldGroup}/>
                      )
                        :
                      (
                        <></>
                      )}
                    </Col>
                  );
                })}
              </Row>
            </Card>
            <br />
          </div>
        );
      })}
    </>
  );
};

export default ApplicationForm;
