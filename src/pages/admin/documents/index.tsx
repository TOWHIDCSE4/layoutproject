import dynamic from "next/dynamic";
import { GridTable } from "@src/components/Table";
import FilterDatePicker from "@src/components/Table/SearchComponents/DatePicker";
import { Button, Tag, Dropdown  ,Badge } from "antd";
import documentService from "@root/src/services/documentService";
import _ from "lodash";
import moment from "moment";
import to from "await-to-js";
import auth from "@src/helpers/auth";
import React, { useState, useRef } from "react";
import useBaseHook from "@src/hooks/BaseHook";
import DocumentTemplate from "@src/config/DocumentTemplate";
import { FilePdfOutlined, FileTextOutlined,MoreOutlined,PlusCircleOutlined } from "@ant-design/icons";
import useStatusCount from "@root/src/hooks/StatusCount";
import type { MenuProps } from 'antd';
import usePermissionHook from "@src/hooks/PermissionHook";


const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const Index = () => {
  const user = auth().user;
  const { t, notify, redirect } = useBaseHook();
  const tableRef = useRef(null);
  const status = useStatusCount();
  const [filterSelect, setFilterSelect] = useState(null);
  const { checkPermission } = usePermissionHook();
  const createPer = checkPermission({
    "document_templates": "C"
  })

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a >
          <FilePdfOutlined />
          PDF
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a >
          <FileTextOutlined />
          CSV
        </a>
      ),
    },
  ];

  const columns = [
    {
      title: t("pages:documents.table.name"),
      dataIndex: "name",
      key: "documents.name",
      sorter: true,
      filterable: true,
    },
    {
      title: t("pages:documents.table.issuedBy"),
      dataIndex: "tenantName",
      key: "tenants.name",
      sorter: true,
      filterable: true,
    },
    {
      title: t("pages:documents.table.issuedDate"),
      dataIndex: "createdAt",
      key: "documents.createdAt",
      sorter: true,
      filterable: true,
      render: (text: string, record: any) =>
        text ? moment(text).format("YYYY-MM-DD HH:mm:ss") : "",
      renderFilter: ({ column, confirm, ref }: FilterParam) => (
        <FilterDatePicker column={column} confirm={confirm} ref={ref} />
      ),
    },
    {
      title: t("pages:documents.table.submitter"),
      dataIndex: "createdByName",
      key: "users.firstName",
      sorter: true,
      filterable: true,
    },
    {
      title: t("pages:documents.table.status"),
      dataIndex: "status",
      key: "documents.status",
      sorter: true,
      filterable: true,
      render: (text: number, record: any) => {
        if(record.status == 3 && user.id != record.createdBy) {
          return (
            <Tag color={DocumentTemplate.documentStatusColor[2]}>
              {DocumentTemplate.documentStatus[2]}
            </Tag>
          );}
        return (
          <Tag color={DocumentTemplate.documentStatusColor[record.status]}>
            {DocumentTemplate.documentStatus[record.status]}
          </Tag>
        );
      },
    },
    {
      title: t("pages:documents.table.updatedAt"),
      dataIndex: "updatedAt",
      key: "documents.updatedAt",
      sorter: true,
      filterable: true,
      render: (text: string, record: any) =>
        text ? moment(text).format("YYYY-MM-DD HH:mm:ss") : "",
      renderFilter: ({ column, confirm, ref }: FilterParam) => (
        <FilterDatePicker column={column} confirm={confirm} ref={ref} />
      ),
    },
    {
      title: t("pages:action"),
      key: "action",
      render: (text, record) => {
        return (
          <div style={{textAlign:'center',width:'100%',zIndex:'100'}}>
            <Dropdown menu={{ items }} placement="topLeft">
              <MoreOutlined />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const fetchData = async (values: any) => {
    if (!values.sorting.length) {
      values.sorting = [{ field: "documents.id", direction: "desc" }];
    }
    let params = {
      ...values,
      status: filterSelect,
    }
    for (let key in params) if (!params[key]) delete params[key];
    let [error, documents]: [any, any[]] = await to(
      documentService().withAuth().getDocument(params)
    );
    if (error) {
      const { code, message } = error;
      notify(t(`errors:${code}`), t(message), "error");
      return {};
    }
    return documents;
  };


  return (
    <>
      <div className="content">
        <div style={{width:'100%',marginBottom:'20px'}}>
          <Button
            type="primary"
            hidden={!createPer}
            onClick={() => redirect("frontend.admin.documentTemplates.create")}
          >
            <PlusCircleOutlined /> Create Document Templates
          </Button>
          <div style={{float:'right'}}>
            <Button onClick={()=> {
              setFilterSelect(null)
              tableRef.current.reload();
            }} >
            <Badge count={status["total"] || 0}  showZero size="small" style={{marginRight:5,backgroundColor:'#dbdada',color:'#000'}} />
            All
            </Button>
            <Button onClick={()=>{              
              setFilterSelect(3)
              tableRef.current.reload();
              }} >
            <Badge count={status["To Be Reviewed"] || 0}  showZero color='#faad14' size="small" style={{marginRight:5}}/>
            To Be Reviewed
            </Button>
            <Button onClick={()=>{              
              setFilterSelect(1000)
              tableRef.current.reload();
              }}>
            <Badge count={status["Approve"] || 0} showZero color='#52c41a' size="small" style={{marginRight:5}} />
            Complete
            </Button>
          </div>
        </div>
        <br/> 
        <GridTable
          ref={tableRef}
          columns={columns}
          fetchData={fetchData}
          addIndexCol={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: event => {redirect("frontend.admin.documents.detail", { id: record.code })}, // click row
            };
          }}
        />
      </div>
    </>
  );
};

Index.Layout = (props) => {
  const { t } = useBaseHook();
  return (
    <Layout
      title={t("pages:documents.index.title")}
      description={t("pages:documents.index.description")}
      {...props}
    />
  );
};

Index.permissions = {
  documents: "R",
};

export default Index;
