import React, { useEffect, useState } from "react";
import { API_ENDPOINTS, fetchWithCredentials } from "./config";

const InstagramMedia = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetchWithCredentials(API_ENDPOINTS.INSTAGRAM_MEDIA);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMedia(data.media || []);
          }
        } else {
          setError("Failed to fetch Instagram media");
        }
      } catch (err) {
        console.error("Error fetching Instagram media:", err);
        setError("Error loading media");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">Loading Instagram posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">No Instagram posts found</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Instagram Posts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {media.slice(0, 9).map((item) => (
          <div key={item.id} className="relative group overflow-hidden rounded-lg shadow-md">
            {item.media_type === "IMAGE" || item.media_type === "CAROUSEL_ALBUM" ? (
              <img
                src={item.media_url}
                alt={item.caption || "Instagram post"}
                className="w-full h-64 object-cover transition-transform group-hover:scale-110"
              />
            ) : item.media_type === "VIDEO" ? (
              <video
                src={item.media_url}
                className="w-full h-64 object-cover"
                controls
              />
            ) : null}
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-end">
              <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {item.caption && (
                  <p className="text-sm line-clamp-2">{item.caption}</p>
                )}
                <p className="text-xs mt-1">
                  {new Date(item.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <a
              href={item.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                className="w-4 h-4 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramMedia;
