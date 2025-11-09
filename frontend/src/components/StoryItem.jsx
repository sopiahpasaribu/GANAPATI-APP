import React from "react";

export default function StoryItem({ s }) {
  return (
    <div className="flex flex-col items-center mr-6 cursor-pointer">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-[3px] hover:scale-105 transition-transform duration-200">
        <div className="w-full h-full rounded-full bg-white p-[2px]">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {s.image_url ? (
              <img
                src={s.image_url}
                alt={s.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <span className="text-gray-500 text-xs">
                {s.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs mt-2 text-gray-700 truncate max-w-[80px]">{s.username}</p>
    </div>
  );
}
