import React, { useContext, useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import logo from "../pictures/Pick-Me-Up-Logo.png";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AuthContext } from "../../context/AuthContext";
import userService from "../../services";
import Pusher from "pusher-js";

const Sidenav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();
  const { isSideBarMenuOpen } = useContext(AuthContext);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingApplications = async () => {
      try {
        const data = await userService.fetchRequirements();
        const pendingApps = data.filter(rider => rider.verification_status === "Pending").length;
        setPendingCount(pendingApps);
      } catch (error) {
        console.error("Error fetching pending applications:", error);
      }
    };

    fetchPendingApplications();
  }, []);

  const handleClick = (item) => {
    if (location.pathname !== item) {
      navigate(item);
    }
  };

  useEffect(() => {

    // Pusher setup
    const pusher = new Pusher("1b95c94058a5463b0b08", {
      cluster: "ap1",
      encrypted: true,
    });

    const channel = pusher.subscribe("requirements");

    // Listen for the DASHBOARD_UPDATE event and update state
    channel.bind("REQUIREMENTS", (data) => {
      const pendingApps = data.filter(rider => rider.verification_status === "Pending").length;
      setPendingCount(pendingApps);
    });

    // Cleanup function
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/riderslist", label: "Manage Riders", parent: "Riders" },
    { path: "/riderspayment", label: "Rider Payment", parent: "Riders" },
    { path: "/ridersapplicant", label: "Rider Requirements", parent: "Riders", showBadge: true },
    { path: "/riderslocation", label: "Rider Location", parent: "Riders" },
    { path: "/manageuser", label: "Manage Users" },
    { path: "/manageadmin", label: "Manage Admin", role: 1 },
    { path: "/bookinghistory", label: "Booking History" },
    { path: "/feedback", label: "Feedbacks" },
    { path: "/report", label: "Reports" },
    { path: "/updatefare", label: "Update Fare", role: 1 },
  ];

  const isActive = (path) => location.pathname === path;
  const isParentActive = (parent) =>
    menuItems
      .filter((item) => item.parent === parent)
      .some((item) => isActive(item.path)) ||
    location.pathname.startsWith("/riders");

  return (
    <>
      {isSideBarMenuOpen && (
        <div className="bg-yellow-500 w-64 h-screen fixed top-0 left-0 overflow-y-auto">
          <div className="p-4 flex justify-between items-center">
            <Link to={"/dashboard"}>
              <div className="flex space-x-2 items-center">
                <img src={logo} alt="Logo" className="h-10 w-10" />
                <span className="text-white font-bold text-xl">PickMeUp</span>
              </div>
            </Link>
          </div>
          <div className="mt-4">
            {/* Dashboard */}
            <button
              onClick={() => handleClick("/dashboard")}
              className={`block w-full text-left px-4 py-2 ${
                isActive("/dashboard")
                  ? "bg-yellow-600 text-white cursor-not-allowed"
                  : "text-black bg-yellow-500 hover:bg-yellow-600"
              }`}
              disabled={isActive("/dashboard")}
            >
              Dashboard
            </button>

            {/* Riders */}
            <Disclosure defaultOpen={isParentActive("Riders")}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="w-full flex justify-between items-center p-4 text-white bg-black mt-2">
                    <div className="flex items-center">
                      <span>Riders</span>
                      {pendingCount > 0 && (
                        <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                    <ChevronDownIcon
                      className={`w-5 h-5 ${open ? "transform rotate-180" : ""}`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="bg-gray-800 text-white">
                    {menuItems
                      .filter((item) => item.parent === "Riders")
                      .map((child, childIndex) => (
                        <button
                          key={childIndex}
                          onClick={() => handleClick(child.path)}
                          className={`block w-full text-left px-4 py-2 ${
                            isActive(child.path)
                              ? "bg-yellow-600 text-white cursor-not-allowed"
                              : "hover:bg-gray-700"
                          } relative`}
                          disabled={isActive(child.path)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{child.label}</span>
                            {child.showBadge && pendingCount > 0 && (
                              <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                {pendingCount}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            {/* Manage Users */}
            <button
              onClick={() => handleClick("/manageuser")}
              className={`block w-full text-left px-4 py-2 ${
                isActive("/manageuser")
                  ? "bg-yellow-600 text-white cursor-not-allowed"
                  : "text-black bg-yellow-500 hover:bg-yellow-600"
              }`}
              disabled={isActive("/manageuser")}
            >
              Manage Users
            </button>

            {/* Manage Admin */}
            {userRole === 1 && (
              <button
                onClick={() => handleClick("/manageadmin")}
                className={`block w-full text-left px-4 py-2 ${
                  isActive("/manageadmin")
                    ? "bg-yellow-600 text-white cursor-not-allowed"
                    : "text-black bg-yellow-500 hover:bg-yellow-600"
                }`}
                disabled={isActive("/manageadmin")}
              >
                Manage Admin
              </button>
            )}

            {/* Update Fare */}
            {userRole === 1 && (
              <button
                onClick={() => handleClick("/updatefare")}
                className={`block w-full text-left px-4 py-2 ${
                  isActive("/updatefare")
                    ? "bg-yellow-600 text-white cursor-not-allowed"
                    : "text-black bg-yellow-500 hover:bg-yellow-600"
                }`}
                disabled={isActive("/updatefare")}
              >
                Update Fare
              </button>
            )}

            {/* Booking History */}
            <button
              onClick={() => handleClick("/bookinghistory")}
              className={`block w-full text-left px-4 py-2 ${
                isActive("/bookinghistory")
                  ? "bg-yellow-600 text-white cursor-not-allowed"
                  : "text-black bg-yellow-500 hover:bg-yellow-600"
              }`}
              disabled={isActive("/bookinghistory")}
            >
              Booking History
            </button>

            {/* Feedback */}
            <button
              onClick={() => handleClick("/feedback")}
              className={`block w-full text-left px-4 py-2 ${
                isActive("/feedback")
                  ? "bg-yellow-600 text-white cursor-not-allowed"
                  : "text-black bg-yellow-500 hover:bg-yellow-600"
              }`}
              disabled={isActive("/feedback")}
            >
              Feedbacks
            </button>

            {/* Report */}
            <button
              onClick={() => handleClick("/report")}
              className={`block w-full text-left px-4 py-2 ${
                isActive("/report")
                  ? "bg-yellow-600 text-white cursor-not-allowed"
                  : "text-black bg-yellow-500 hover:bg-yellow-600"
              }`}
              disabled={isActive("/report")}
            >
              Reports
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidenav;