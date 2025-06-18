"use client";

import { useState } from "react";

interface Video {
  link: string;
  category: string;
  description: string;
}

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
  const [videos, setVideos] = useState<Video[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<string[]>(["General"]);
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [newCategory, setNewCategory] = useState("");
  const [description, setDescription] = useState("");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({
    General: true,
  });
  const [overlayPos, setOverlayPos] = useState({ x: 0, y: 0 });
  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX - overlayPos.x;
    const startY = e.clientY - overlayPos.y;
    const move = (ev: PointerEvent) => {
      setOverlayPos({ x: ev.clientX - startX, y: ev.clientY - startY });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const toggleCat = (c: string) => {
    setOpenCats({ ...openCats, [c]: !openCats[c] });
  };

  const handleAdd = () => {
    if (!link) return;
    const cat =
      selectedCategory === "__new__" ? newCategory.trim() : selectedCategory;
    if (!cat) return;
    if (selectedCategory === "__new__" && !categories.includes(cat)) {
      setCategories([...categories, cat]);
      setOpenCats({ ...openCats, [cat]: true });
    }
    setVideos([...videos, { link, category: cat, description }]);
    setLink("");
    setSelectedCategory("General");
    setNewCategory("");
    setDescription("");
    setStep(1);
    setShowOverlay(false);
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Share YouTube videos</h1>
      <button
        onClick={() => setShowOverlay(true)}
        className="bg-blue-600 text-white px-4 py-2 mb-4 rounded-lg"
      >
        Add Video
      </button>

      {categories.map((c) => (
        <div key={c} className="mb-4">
          <button
            onClick={() => toggleCat(c)}
            className="w-full flex justify-between items-center bg-gray-700 text-white px-4 py-3 rounded"
          >
            <span>{c}</span>
            <span
              className={`transform transition-transform ${openCats[c] ? "rotate-90" : ""}`}
            >
              ▶
            </span>
          </button>
          <ul
            className={`grid gap-4 mt-2 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300 ${
              openCats[c] ? "max-h-screen" : "max-h-0 overflow-hidden"
            }`}
          >
            {videos
              .filter((v) => v.category === c)
              .map((video, index) => {
                const id = getVideoId(video.link);
                const thumb = id
                  ? `https://img.youtube.com/vi/${id}/0.jpg`
                  : null;
                return (
                  <li
                    key={index}
                    className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
                  >
                    <a
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {thumb ? (
                        <img
                          className="p-4 rounded-t-lg"
                          src={thumb}
                          alt="Video thumbnail"
                        />
                      ) : (
                        <span className="text-blue-600 underline p-4 block">
                          {video.link}
                        </span>
                      )}
                    </a>
                    <div className="px-5 pb-5">
                      <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {video.description || video.link}
                      </h5>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {video.category}
                      </p>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}

      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg text-white"
            style={{
              transform: `translate(${overlayPos.x}px, ${overlayPos.y}px)`,
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <div
                onPointerDown={startDrag}
                className="cursor-move text-gray-400 hover:text-white mr-2"
                title="Drag"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M7 4a1 1 0 112 0 1 1 0 01-2 0zM11 4a1 1 0 112 0 1 1 0 01-2 0zM7 8a1 1 0 112 0 1 1 0 01-2 0zM11 8a1 1 0 112 0 1 1 0 01-2 0zM7 12a1 1 0 112 0 1 1 0 01-2 0zM11 12a1 1 0 112 0 1 1 0 01-2 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold">
                Add your video link here
              </h2>
              <button
                onClick={() => {
                  setShowOverlay(false);
                  setStep(1);
                  setNewCategory("");
                  setSelectedCategory("General");
                }}
                className="text-gray-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="relative overflow-hidden w-full">
              <div
                className={`flex transition-transform duration-300 ${
                  step === 1 ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <div className="w-full flex-shrink-0">
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Paste YouTube link"
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 mb-4 text-white"
                  />
                  <button
                    onClick={() => link && setStep(2)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                  >
                    Next
                  </button>
                </div>
                <div className="w-full flex-shrink-0 pl-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 mb-2 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="__new__">Add new...</option>
                  </select>
                  {selectedCategory === "__new__" && (
                    <input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New category name"
                      className="w-full p-2 rounded bg-gray-700 border border-gray-600 mb-2 text-white"
                    />
                  )}
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description"
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 mb-4 text-white"
                  />
                  <button
                    onClick={handleAdd}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
