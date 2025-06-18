"use client";

import { useState } from "react";
export default function Home() {
  const [link, setLink] = useState("");
  const [videos, setVideos] = useState<string[]>([]);

  const handleAdd = () => {
    if (!link) return;
    setVideos([...videos, link]);
    setLink("");
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Share YouTube videos</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Paste YouTube link"
          className="border p-2 flex-grow"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Share
        </button>
      </div>
      <ul className="list-disc pl-5">
        {videos.map((video, index) => (
          <li key={index}>
            <a
              href={video}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {video}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
