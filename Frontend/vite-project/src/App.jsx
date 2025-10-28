import { useState, useEffect } from "react";
import "./App.css";
import LoginButton from "./Button";
import InstagramButton from "./InstagramButton";
import Dashboard from "./Dashboard";




function App() {
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    // Check if we're on the dashboard route
    const path = window.location.pathname;
    if (path === "/dashboard") {
      setCurrentPage("dashboard");
    }

    // Check for authentication errors in URL
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error) {
      if (error === "auth_failed") {
        alert("Authentication failed. Please try again.");
      } else if (error === "callback_error") {
        alert("An error occurred during authentication. Please try again.");
      }
      // Clean up URL
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  if (currentPage === "dashboard") {
    return <Dashboard />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Welcome to Triposaints
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Connect with Facebook or Instagram to continue
        </p>
        <div className="flex flex-col gap-4 justify-center">
          <LoginButton />
          <InstagramButton />
        </div>
      </div>
    </div>
  );
}

export default App;
