import React, { useState } from "react";

export default function Post({ p }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-white p-[2px] flex items-center justify-center">
              <span className="font-bold text-sm text-gray-900">
                {p.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <div className="font-semibold text-sm text-gray-900">{p.username}</div>
            <div className="text-xs text-gray-500">
              {new Date(p.createdat).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="7" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="17" r="1.5" />
          </svg>
        </button>
      </div>

      {p.image_url && (
        <div className="aspect-square bg-gray-100">
          <img
            src={p.image_url}
            alt="post"
            className="w-full h-full object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex space-x-4">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-1 rounded-full transition-colors ${
                liked
                  ? "text-red-500"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              ❤️
            </button>
            <button className="text-gray-700 hover:text-gray-900 p-1 rounded-full transition-colors">
              💬
            </button>
            <button className="text-gray-700 hover:text-gray-900 p-1 rounded-full transition-colors">
              🔗
            </button>
          </div>
          <button
            onClick={() => setSaved(!saved)}
            className={`p-1 rounded-full transition-colors ${
              saved
                ? "text-black"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            🔖
          </button>
        </div>
        <div className="text-sm font-semibold text-gray-900 mb-2">
          1,234 suka
        </div>
        <div className="text-sm leading-relaxed">
          <span className="font-semibold text-gray-900 mr-2">
            {p.username}
          </span>
          {p.content}
        </div>
      </div>
    </div>
  );
}
