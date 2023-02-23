import React from 'react';
import Head from 'next/head';
import { Row, Col, Layout,BackTop } from 'antd'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const { Content, Footer } = Layout;
import useBaseHooks from "@src/hooks/BaseHook";

const Login = (props: any) => {
  const { t } = useBaseHooks();
  return <Layout>
    <Head>
      <title>Update User Infor</title>
      <meta property="og:title" content={props.title || publicRuntimeConfig.TITLE} />
      <meta property="og:description" content={props.description || publicRuntimeConfig.DESCRIPTION} />
      <link rel="shortcut icon" type="image/png" href={publicRuntimeConfig.FAVICON} />
      <meta property="og:image" content={publicRuntimeConfig.LOGO} />
      <link rel="apple-touch-icon" href={publicRuntimeConfig.LOGO}></link>
    </Head>
    <div id="login">
      <Content className="content">
          <div className="background-login"></div>
          <div className="background-login-display"></div>
          <div >
            {/* <Row gutter={[24, 0]}> */}
              {/* <Col md={{span: 12, offset: 8}} xs={24}> */}
              {props.children}
              {/* </Col> */}
            {/* </Row> */}
          </div>
      </Content>
    </div>
    
  </Layout>
}

export default Login;
