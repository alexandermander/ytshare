"use client";

import { useState, useRef } from "react";

interface Video {
  link: string;
  category: string;
  description: string;
}

interface Category {
  name: string;
  x: number;
  y: number;
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
  const [categories, setCategories] = useState<Category[]>([
    { name: "General", x: 0, y: 0 },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [newCategory, setNewCategory] = useState("");
  const [description, setDescription] = useState("");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({ General: true });
  const [showCatEditor, setShowCatEditor] = useState(false);
  const dragging = useRef(false);

  const startDrag = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const init = categories[index];

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      setCategories((cats) => {
        const newCats = [...cats];
        newCats[index] = { ...newCats[index], x: init.x + dx, y: init.y + dy };
        return newCats;
      });
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      setTimeout(() => {
        dragging.current = false;
      }, 0);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const updateCategory = (
    index: number,
    data: Partial<Omit<Category, "name">>
  ) => {
    setCategories((cats) => {
      const newCats = [...cats];
      newCats[index] = { ...newCats[index], ...data };
      return newCats;
    });
  };

  const toggleCat = (c: string) => {
    if (dragging.current) return;
    setOpenCats({ ...openCats, [c]: !openCats[c] });
  };

  const handleAdd = () => {
    if (!link) return;
    const cat = selectedCategory === "__new__" ? newCategory.trim() : selectedCategory;
    if (!cat) return;
    if (selectedCategory === "__new__" && !categories.some((c) => c.name === cat)) {
      setCategories([...categories, { name: cat, x: 0, y: 0 }]);
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
    <main className="p-4 relative min-h-screen">
      <h1 className="text-xl font-bold mb-4">Share YouTube videos</h1>
      <button
        onClick={() => setShowOverlay(true)}
        className="bg-blue-600 text-white px-4 py-2 mb-4 rounded-lg"
      >
        Add Video
      </button>
      <button
        onClick={() => setShowCatEditor(true)}
        className="bg-gray-600 text-white px-4 py-2 mb-4 rounded-lg ml-2"
      >
        Manage Categories
      </button>

        {categories.map((c, idx) => (
          <div
            key={c.name}
            className="mb-4 absolute w-max"
            style={{ left: c.x, top: c.y }}
          >

            <button
              onClick={() => toggleCat(c.name)}
              className="w-full max-w-sm flex justify-between items-center bg-gray-700 text-white px-2 py-1 rounded"
            >
              <span className="flex items-center">
                <span
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    startDrag(e, idx);
                  }}
                  className="mr-2 cursor-move text-gray-300 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M4 9h16v2H4zm0 4h16v2H4z" />
                  </svg>
                </span>
                {c.name}
              </span>
              <span
                className={`transform transition-transform ${openCats[c.name] ? "rotate-90" : ""}`}
              >
                ▶
              </span>
            </button>
          <ul
            className={`grid gap-4 mt-2 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300 ${
              openCats[c.name] ? "max-h-screen" : "max-h-0 overflow-hidden"
            }`}
          >
            {videos
              .filter((v) => v.category === c.name)
              .map((video, index) => {
                const id = getVideoId(video.link);
                const thumb = id ? `https://img.youtube.com/vi/${id}/0.jpg` : null;
                return (
                  <li
                    key={index}
                    className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
                  >
                    <a href={video.link} target="_blank" rel="noopener noreferrer">
                      {thumb ? (
                        <img className="p-4 rounded-t-lg" src={thumb} alt="Video thumbnail" />
                      ) : (
                        <span className="text-blue-600 underline p-4 block">{video.link}</span>
                      )}
                    </a>
                    <div className="px-5 pb-5">
                      <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {video.description || video.link}
                      </h5>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{video.category}</p>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}

      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add your video link here</h2>
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
                      <option key={c.name} value={c.name}>
                        {c.name}
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

      {showCatEditor && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Category positions</h2>
              <button
                onClick={() => setShowCatEditor(false)}
                className="text-gray-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>
            {categories.map((c, i) => (
              <div key={c.name} className="mb-2">
                <p className="font-semibold">{c.name}</p>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={c.x}
                    onChange={(e) => updateCategory(i, { x: parseInt(e.target.value) || 0 })}
                    className="p-1 rounded bg-gray-700 border border-gray-600 w-24"
                  />
                  <input
                    type="number"
                    value={c.y}
                    onChange={(e) => updateCategory(i, { y: parseInt(e.target.value) || 0 })}
                    className="p-1 rounded bg-gray-700 border border-gray-600 w-24"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
