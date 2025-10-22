import React from "react";

const FacebookLoginButton = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/facebook";
  };

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      Login with Facebook
    </button>
  );
};

export default FacebookLoginButton;
