import React, { useState } from "react";
import { Form, Col, Row, Input, Select, Button } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const FieldListRadioSource = ({ nameListSource }) => {
  return (
    <>
      {
        <Col span={24}>
          <Form.List name={[nameListSource, "tableSelect"]}>
            {(fields, { add, remove }) => (
              <div onClick={(e) => e.stopPropagation()}>
                {fields.map((field, index, fullarr) => {
                  let { key, name, ...restField } = field;
                  return (
                    <Row key={key} style={{ textAlign: "center" }}>
                      <Col span={4}></Col>
                      <Col span={7}>
                        <Form.Item
                          name={[name, "title"]}
                          rules={[
                            { required: true, message: "Missing Title Option" },
                          ]}
                        >
                          <Input placeholder="Title Col" />
                        </Form.Item>
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        <Form.Item
                          name={[name, "dataIndex"]}
                          rules={[
                            { required: true, message: "Missing dataIndex Col" },
                          ]}
                        >
                          <Input placeholder="DataIndex" />
                        </Form.Item>
                      </Col>
                      <Col span={1}>
                        <MinusCircleOutlined
                          style={{ marginTop: 10 }}
                          onClick={() => remove(name)}
                        />
                      </Col>
                    </Row>
                  );
                })}
                <Form.Item className="text-center">
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    icon={<PlusOutlined />}
                    style={{ width: "60%" }}
                  >
                    Add Col Table
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Col>
      }
    </>
  );
};

export default FieldListRadioSource;
