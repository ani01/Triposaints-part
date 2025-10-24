import React, { useEffect, useState } from "react";
import { API_ENDPOINTS, fetchWithCredentials } from "./config";
import InstagramMedia from "./InstagramMedia";
import InstagramUserSearch from "./InstagramUserSearch";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data from backend
    const fetchUser = async () => {
      try {
        const response = await fetchWithCredentials(API_ENDPOINTS.GET_USER);

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          }
        } else {
          setError("Not authenticated");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetchWithCredentials(API_ENDPOINTS.LOGOUT);

      if (response.ok) {
        // Redirect to home page after logout
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-xl text-red-600 mb-4">
          {error || "Please login first"}
        </div>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <div className="flex items-center space-x-4 mb-6">
            {user.photo && (
              <img
                src={user.photo}
                alt={user.displayName}
                className="w-20 h-20 rounded-full"
              />
            )}
            <div>
              <h2 className="text-2xl font-semibold">{user.displayName}</h2>
              {user.email && (
                <p className="text-gray-600">{user.email}</p>
              )}
              <p className="text-gray-500 text-sm">ID: {user.id}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">User Information</h3>
            <div className="space-y-2">
              <div className="flex">
                <span className="font-medium w-32">Provider:</span>
                <span className="capitalize">{user.provider || "Facebook"}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-32">Name:</span>
                <span>{user.displayName}</span>
              </div>
              {user.username && (
                <div className="flex">
                  <span className="font-medium w-32">Username:</span>
                  <span>@{user.username}</span>
                </div>
              )}
              {user.email && (
                <div className="flex">
                  <span className="font-medium w-32">Email:</span>
                  <span>{user.email}</span>
                </div>
              )}
              <div className="flex">
                <span className="font-medium w-32">User ID:</span>
                <span>{user.id}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {/* Show Instagram posts if user logged in with Instagram */}
          {user.provider === "instagram" && (
            <InstagramMedia />
          )}

          {/* Instagram User Search - Available for all authenticated users */}
          <InstagramUserSearch />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
