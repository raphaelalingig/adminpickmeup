import React, { useState, useEffect } from "react";
import Sidenav from "../../parts/Sidenav";
import userService from "../../../services";
import swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UpdateFare = () => {
  const [formData, setFormData] = useState({
    first2km: "", // Default 40
    exceeding2km: "", // Default 12
    password: "", // For superadmin authentication
  });
  const [isEditable, setIsEditable] = useState(false);
  const [originalData, setOriginalData] = useState({});

  // Fetch fare data on mount
  useEffect(() => {
    const fetchFareData = async () => {
      try {
        const response = await userService.getFare(); // Adjust based on your service method
        const fareData = {
          first2km: response.first_2km || "40",
          exceeding2km: response.exceeding_2km || "12",
        };
        setFormData({
          ...fareData,
          password: "", // Password starts empty
        });
        setOriginalData(fareData);
      } catch (error) {
        console.error("Error fetching fare data:", error);
        alert("Failed to fetch fare data.");
      }
    };

    fetchFareData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      alert("Password is required for authentication.");
      return;
    }

    try {
      const dataToSend = {
        first_2km: formData.first2km,
        exceeding_2km: formData.exceeding2km,
        password: formData.password,
      };
      await userService.updateFare(dataToSend);
      swal.fire({
        title: "Fare updated successfully!",
        icon: "success",
        toast: true,
        timer: 4000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      setIsEditable(false);
      setOriginalData({
        first2km: formData.first2km,
        exceeding2km: formData.exceeding2km,
      });
      setFormData({
        ...formData,
        password: "",
      });
    } catch (error) {
      console.error("Error updating fare:", error);
      swal.fire({
        title: "Incorrect Password! Please Try Again.",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const handleCancel = () => {
    // Revert to original data when cancelling
    setFormData({
      ...originalData,
      password: "",
    });
    setIsEditable(false);
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleEdit = () => {
    setIsEditable(true);
  };

  return (
   <div className="flex h-screen overflow-hidden">
      <div className="z-[9999]">
        <Sidenav />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 p-3 bg-gray-100 overflow-auto">
            <h1 className="text-2xl font-bold mb-6">Update Fare</h1>
            <form
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
              onSubmit={handleSubmit}
            >
              {/* First 2 kilometers */}
              <div className="mb-4">
                <label
                  htmlFor="first2km"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  First 2 kilometers Fare
                </label>
                <input
                  type="text"
                  id="first2km"
                  name="first2km"
                  value={formData.first2km}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    !isEditable ? "bg-gray-200 cursor-not-allowed" : ""
                  }`}
                  placeholder="40"
                  required
                />
              </div>

              {/* Exceeding 2 kilometers */}
              <div className="mb-4">
                <label
                  htmlFor="exceeding2km"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Exceeding 2 kilometers Fare
                </label>
                <input
                  type="text"
                  id="exceeding2km"
                  name="exceeding2km"
                  value={formData.exceeding2km}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    !isEditable ? "bg-gray-200 cursor-not-allowed" : ""
                  }`}
                  placeholder="12"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} // Toggle between text and password
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      !isEditable ? "bg-gray-200 cursor-not-allowed" : ""
                    }`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)} // Toggle showPassword state
                    className="absolute right-3 top-2 text-gray-600 hover:text-gray-900"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" /> // Hide password icon
                    ) : (
                      <FaEye className="h-5 w-5" /> // Show password icon
                    )}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between space-x-4">
                {!isEditable ? (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Update Fare
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </form>
          </main>
        </div>
      </div>
    
  );
};

export default UpdateFare;
