import React from "react";
import StoryItem from "./StoryItem";

export default function StoryBar({ stories }) {
  if (!stories.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 overflow-x-auto scrollbar-hide">
      <div className="flex flex-nowrap space-x-2">
        {stories.map((s) => (
          <StoryItem key={s.id} s={s} />
        ))}
      </div>
    </div>
  );
}
