import React, { useState } from "react";
import { API_ENDPOINTS, fetchWithCredentials } from "./config";

const InstagramUserSearch = () => {
  const [username, setUsername] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      const response = await fetchWithCredentials(
        `${API_ENDPOINTS.INSTAGRAM_SEARCH_USER}?username=${encodeURIComponent(username)}`
      );

      const data = await response.json();
      setSearchResult(data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search user");
    } finally {
      setLoading(false);
    }
  };

  const openInstagramProfile = () => {
    if (username.trim()) {
      window.open(`https://www.instagram.com/${username.trim()}`, "_blank");
    }
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-4">Search Instagram Users</h3>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Instagram username..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
          {error}
        </div>
      )}

      {searchResult && (
        <div className="space-y-4">
          {searchResult.success ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">{searchResult.message}</p>
            </div>
          ) : (
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3 mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Instagram API Limitation
                  </h4>
                  <p className="text-blue-800 mb-3">
                    {searchResult.message || searchResult.info?.note}
                  </p>
                  
                  {searchResult.info?.requirements && (
                    <div className="mt-4">
                      <p className="font-semibold text-blue-900 mb-2">
                        {searchResult.info.alternative}
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800 ml-2">
                        {searchResult.info.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-blue-900 font-semibold mb-2">
                      Available Alternative:
                    </p>
                    <button
                      onClick={openInstagramProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      View @{username} on Instagram
                    </button>
                    <p className="text-sm text-blue-700 mt-2">
                      Opens Instagram profile in a new tab
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Information Section */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">
          📘 About User Search Limitations
        </h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Instagram Basic Display API only accesses your own posts</li>
          <li>Searching other users requires Instagram Graph API</li>
          <li>Graph API requires a Business/Creator Instagram account</li>
          <li>You can view any public profile directly on Instagram.com</li>
        </ul>
      </div>
    </div>
  );
};

export default InstagramUserSearch;
