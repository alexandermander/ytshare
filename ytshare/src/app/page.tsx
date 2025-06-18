"use client";

import { useState } from "react";

function getVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1);
    }
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}
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
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, index) => {
          const id = getVideoId(video);
          const thumb = id
            ? `https://img.youtube.com/vi/${id}/0.jpg`
            : null;
          return (
            <li key={index} className="list-none">
              <a href={video} target="_blank" rel="noopener noreferrer">
                {thumb ? (
                  <img
                    src={thumb}
                    alt="Video thumbnail"
                    className="w-full max-w-xs border"
                  />
                ) : (
                  <span className="text-blue-600 underline">{video}</span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
