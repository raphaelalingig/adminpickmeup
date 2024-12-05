import React, { useState } from "react";
import Sidenav from "../../parts/Sidenav";
import Header from "../../parts/Header";

const UpdateFare = () => {
  const [formData, setFormData] = useState({
    fairName: "",
    location: "",
    date: "", // Initialize with an empty string
    description: "",
  });

  const [isEditable, setIsEditable] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Fair Data: ", formData);
    // Add logic to send formData to the server.
    setIsEditable(false); // Disable editing after submission
  };

  const handleEdit = () => {
    setIsEditable(true);
    // Set the date field to the current date
    const currentDate = new Date().toISOString().split("T")[0]; // Get the current date in YYYY-MM-DD format
    setFormData({ ...formData, date: currentDate });
  };

  return (
    <div className="min-h-screen flex">
      {/* Side Navigation */}
      <Sidenav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Update Fair Form */}
        <main className="p-8">
          <h1 className="text-2xl font-bold mb-6">Update Fair</h1>
          <form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            onSubmit={handleSubmit}
          >
            {/* Fair Name */}
            <div className="mb-4">
              <label
                htmlFor="fairName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                First 2 kilometers
              </label>
              <input
                type="text"
                id="fairName"
                name="fairName"
                value={formData.fairName}
                onChange={handleChange}
                disabled={!isEditable}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  !isEditable ? "bg-gray-200 cursor-not-allowed" : ""
                }`}
                placeholder="40"
                required
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label
                htmlFor="location"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Exceeding 2 kilometers
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!isEditable}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  !isEditable ? "bg-gray-200 cursor-not-allowed" : ""
                }`}
                placeholder="12"
                required
              />
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="block text-gray-700">Password:</label>
              <input
                type="password"
                name="password"
                value={""}
                className="border rounded w-full py-2 px-3 text-gray-700"
                onChange={handleChange}
                disabled={!isEditable}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              {!isEditable ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Edit
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Fare
                </button>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default UpdateFare;
