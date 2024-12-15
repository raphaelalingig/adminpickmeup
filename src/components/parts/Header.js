import React, { useContext, useState, useEffect } from "react";
import { Menu, Dialog, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import UserIcon from "../pictures/User-icon.png";
import userService from "../../services";
import { useAuth } from "../../hooks/useAuth";
import { AuthContext } from "../../context/AuthContext";
import { BellIcon } from "@heroicons/react/outline";
import Pusher from "pusher-js";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0); // State for pending verifications
  const { logout } = useAuth();
  const { isSideBarMenuOpen, setIsSideBarMenuOpen } = useContext(AuthContext);

  // Fetch pending applications
  const fetchPendingApplications = async () => {
    try {
      const data = await userService.fetchRequirements();
      const pendingApps = data.filter(
        (rider) => rider.verification_status === "Pending"
      ).length;
      setPendingCount(pendingApps);
    } catch (error) {
      console.error("Error fetching pending applications:", error);
    }
  };
  
  // useEffect(() => {
  //   const fetchPendingApplications = async () => {
  //     try {
  //       const data = await userService.fetchRequirements();
  //       const pendingApps = data.filter(
  //         (rider) => rider.verification_status === "Pending"
  //       ).length;
  //       setPendingCount(pendingApps);
  //     } catch (error) {
  //       console.error("Error fetching pending applications:", error);
  //     }
  //   };

  //   fetchPendingApplications();
  // }, []);

  // Pusher setup for booking updates
  useEffect(() => {
    // Initial data fetch
    fetchPendingApplications();

    // Pusher setup
    const pusher = new Pusher("1b95c94058a5463b0b08", {
      cluster: "ap1",
      encrypted: true,
    });

    const channel = pusher.subscribe("requirements");

    // Listen for the DASHBOARD_UPDATE event and update state
    channel.bind("REQUIREMENTS", (data) => {
      console.log("header data", data);
      fetchPendingApplications();
    });

    // Cleanup function
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [fetchPendingApplications]);

  const handleLogout = async () => {
    try {
      await userService.logout();
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      // 768px is Tailwind's md breakpoint
      if (window.innerWidth >= 768) {
        setIsSideBarMenuOpen(false);
      }
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSideBarMenuOpen]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMenuSideBar = () => {
    setIsSideBarMenuOpen(!isSideBarMenuOpen);
    console.log(isSideBarMenuOpen);
  };


   const [isInfoVisible, setIsInfoVisible] = useState(false);

   const toggleInfo = () => {
     setIsInfoVisible(!isInfoVisible);
   };


  return (
    <>
      <header className="bg-black text-white flex items-center justify-between p-4 relative z-50">
        <div className="flex items-center space-x-2 relative">
          {/* Hamburger Icon */}
          <div
            onClick={handleMenuSideBar}
            className={`p-2 ${
              isSideBarMenuOpen ? "ml-60" : "justify-start"
            } hover:bg-[#C8A400] rounded-full cursor-pointer relative`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            {/* Red Dot */}
            {pendingCount > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </div>
        </div>

        <div className="relative flex items-center space-x-6">
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button className="flex items-center space-x-2">
                  <span>ADMIN</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 ${open ? "transform rotate-180" : ""}`}
                  />
                  <img
                    src={UserIcon}
                    alt="User Icon"
                    className="h-6 w-6 rounded-full"
                  />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-[#343536] shadow-lg rounded-lg overflow-hidden z-50">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={() => navigate("/manageacc")}
                        className={`block px-4 py-2 text-white cursor-pointer ${
                          active ? "bg-gray-600" : ""
                        }`}
                      >
                        Manage Account
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        onClick={handleLogout}
                        className={`block px-4 py-2 text-white cursor-pointer ${
                          active ? "bg-gray-600" : ""
                        }`}
                      >
                        Logout
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </>
            )}
          </Menu>
        </div>
      </header>

      {/* Confirmation Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Logout
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to log out?
                    </p>
                  </div>

                  <div className="mt-4 flex space-x-4 justify-end">
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg"
                      onClick={() => {
                        handleLogout();
                        closeModal();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Header;
