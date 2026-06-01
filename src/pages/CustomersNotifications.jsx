import React from "react";
import NavBar from "../components/NavBar";
import Notifications from "../components/Notifications";
import Footer from "../components/Footer";

const CustomersNotifications = () => {
  return (
    <div className="bg-surface-100">
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 py-4 bg-surface-50 mt-20 min-h-screen">
        <Notifications />
      </div>
      <Footer/>
    </div>
  );
};

export default CustomersNotifications;
