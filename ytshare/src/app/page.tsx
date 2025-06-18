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

        const handleAdd = () => {
                if (!link) return;
                const cat = newCategory.trim() || selectedCategory;
                if (newCategory && !categories.includes(newCategory)) {
                        setCategories([...categories, newCategory]);
                }
                setVideos([
                        ...videos,
                        { link, category: cat, description },
                ]);
                setLink("");
                setSelectedCategory(categories[0] ?? "");
                setNewCategory("");
                setDescription("");
                setStep(1);
        };

	// add a full screnn gray overlay with a text files with round corners and a close button where
	// ther is sadingin "add your video link here" and a button to add the link
	return (
		<main className="p-4">
			<p > https://www.youtube.com/watch?v=sFsoWM7wMQM </p>
			<h1 className="text-xl font-bold mb-4">Share YouTube videos</h1>
			<button
				onClick={() => setShowOverlay(true)}
				className="bg-blue-600 text-white px-4 py-2 mb-4 rounded-lg"
			>
				Add Video
			</button>

                        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {videos.map((video, index) => {
                                        const id = getVideoId(video.link);
                                        const thumb = id ? `https://img.youtube.com/vi/${id}/0.jpg` : null;
                                        return (

						// add wite background
						// make the background oapacity 0.8
						
                                                <li key={index} className="flex flex-col items-center bg-gray-800 p-4 rounded-lg shadow-lg">
                                                        <a href={video.link} target="_blank" rel="noopener noreferrer">
                                                                {thumb ? (
                                                                        <img
                                                                                src={thumb}
                                                                                alt="Video thumbnail"
                                                                                className="max-w-xs rounded-lg shadow-md"
                                                                        />
                                                                ) : (
                                                                        <span className="text-blue-600 underline">{video.link}</span>
                                                                )}
                                                        </a>
                                                        <p className="mt-2 text-sm text-gray-400">{video.category}</p>
                                                        {video.description && (
                                                                <p className="text-sm mt-1 text-gray-300">{video.description}</p>
                                                        )}
                                                </li>
                                        );
                                })}
                        </ul>

                        {showOverlay && (
                                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-white">
                                                <div className="flex justify-between items-center mb-4">
                                                        <h2 className="text-lg font-semibold">Add your video link here</h2>
                                                        <button
                                                                onClick={() => {
                                                                        setShowOverlay(false);
                                                                        setStep(1);
                                                                }}
                                                                className="text-gray-400 hover:text-white text-xl font-bold"
                                                        >
                                                                &times;
                                                        </button>
                                                </div>
                                                <div className="relative overflow-hidden w-full">
                                                        <div className={`flex transition-transform duration-300 ${step === 1 ? 'translate-x-0' : '-translate-x-full'}`}> 
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
                                                                                        <option key={c} value={c}>{c}</option>
                                                                                ))}
                                                                        </select>
                                                                        <input
                                                                                value={newCategory}
                                                                                onChange={(e) => setNewCategory(e.target.value)}
                                                                                placeholder="Or create new category"
                                                                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 mb-2 text-white"
                                                                        />
                                                                        <textarea
                                                                                value={description}
                                                                                onChange={(e) => setDescription(e.target.value)}
                                                                                placeholder="Add a description"
                                                                                className="w-full p-2 rounded bg-gray-700 border border-gray-600 mb-4 text-white"
                                                                        />
                                                                        <button
                                                                                onClick={() => {
                                                                                        handleAdd();
                                                                                        setShowOverlay(false);
                                                                                }}
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
