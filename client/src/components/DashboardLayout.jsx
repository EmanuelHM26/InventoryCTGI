import React from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import Main from "./Main";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
        <Main>{children}</Main>
      </div>
    </div>
  );
};

export default DashboardLayout;