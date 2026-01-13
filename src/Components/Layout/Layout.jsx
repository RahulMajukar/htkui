import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
// import SystemTimeoutPopup from "../SystemTimeoutPopup";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const hideLayout = location.pathname === "/login"; // hide on login page

  if (hideLayout) return <Outlet />; // render only login page without layout

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar (fixed) */}
      <div className="fixed top-0 left-0 h-full z-40">
        <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Main wrapper (shifts with sidebar, but navbar stays full) */}
      <div
        className={`flex flex-col w-full transition-all duration-300 ease-in-out`}
        style={{ marginLeft: isSidebarOpen ? "16rem" : "4rem" }} // shift content only
      >
        {/* Navbar (fixed & full width) */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        {/* Main content (below navbar) */}
        <div className="pt-16 flex-1 overflow-hidden">
          <main className="h-full w-full p-6 overflow-auto bg-gray-50">
            <Outlet />
          </main>
        </div>
      </div>

      {/* System Timeout Popup */}
      {/* <SystemTimeoutPopup /> */}
    </div>
  );
}
