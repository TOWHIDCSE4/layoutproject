import React from "react";
import dynamic from "next/dynamic";
import useBaseHook from "@src/hooks/BaseHook";

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const Overview = () => {
  return (
    <div className="content">
      <h1></h1>
    </div>
  );
};

Overview.Layout = (props) => {
  const { t } = useBaseHook();

  return (
    <Layout
      title={t("pages:application.index.title")}
      description={t("pages:application.index.description")}
      {...props}
    />
  );
};

Overview.permissions = {};

export default Overview;
