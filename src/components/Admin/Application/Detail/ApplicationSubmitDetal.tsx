import useBaseHooks from "@root/src/hooks/BaseHook";
import { Tabs, Form, Input } from "antd";

const { TextArea } = Input;

const ApplicationSubmitDetal = ({
  disabled = {
    1: false,
    2: false,
    3: false,
  },
}: {
  disabled: {
    [key: string]: boolean;
  };
}) => {
  const { t, getData, router } = useBaseHooks();

  return (
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          label: "Your Comments",
          key: "1",
          disabled: disabled[1],
          children: (
            <Form.Item name="comment_Your_Comments_Basic" rules={[]}>
              <TextArea
                style={{ height: 150 }}
                placeholder={"Give Reasons if You Wish To Reject This Form"}
              />
            </Form.Item>
          ),
        },
        {
          label: "Tenant Admin Comments",
          key: "2",
          disabled: disabled[2],
          children: (
            <Form.Item name="comment_Tenant_Admin_Comments_Basic" rules={[]}>
              <TextArea
                style={{ height: 150 }}
                placeholder={"Give Reasons if You Wish To Reject This Form"}
              />
            </Form.Item>
          ),
        },
        {
          label: "Issuer Comments",
          key: "3",
          disabled: disabled[3],
          children: (
            <Form.Item name="comment_Issuer_Comments_Basic" rules={[]}>
              <TextArea
                style={{ height: 150 }}
                placeholder={"Give Reasons if You Wish To Reject This Form"}
              />
            </Form.Item>
          ),
        },
      ]}
    />
  );
};

export default ApplicationSubmitDetal;
