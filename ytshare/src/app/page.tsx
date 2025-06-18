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
	const [showOverlay, setShowOverlay] = useState(false);

	const handleAdd = () => {
		if (!link) return;
		setVideos([...videos, link]);
		setLink("");
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
					const id = getVideoId(video);
					const thumb = id ? `https://img.youtube.com/vi/${id}/0.jpg` : null;
					return (

						// add wite background
						// make the background oapacity 0.8
						
						<li key={index} className="flex 
							flex-col 
							items-center
							bg-gray-800
							p-4 rounded-lg shadow-lg">
							<a href={video}
							target="_blank"
							rel="noopener
							noreferrer">
								{thumb ? (
									<img
										src={thumb}
										alt="Video thumbnail"
										className="max-w-xs rounded-lg shadow-md   "
									/>
								) : (
									<span className="text-blue-600 underline">{video}</span>
								)}
							</a>
						</li>
					);
				})}
			</ul>

			{showOverlay && (
				<div
					className="
					fixed inset-0
					bg-black
					bg-opacity-80
					flex items-center justify-center z-50"
				>
					<div
						className="bg-gray-800 
						p-6
						rounded-lg 
						shadow-lg w-full max-w-md text-white"
					>
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-semibold">
								Add your video link here
							</h2>
							<button
								onClick={() => setShowOverlay(false)}
								className="text-gray-400 hover:text-white text-xl font-bold"
							>
								&times;
							</button>
						</div>
						<input
							value={link}
							onChange={(e) => setLink(e.target.value)}
							placeholder="Paste YouTube link"
							className="w-full p-2 rounded bg-gray-700 border border-gray-600 mb-4 text-white"
						/>
						<button
							onClick={() => {
								handleAdd(); // assuming this adds the video
								setShowOverlay(false);
							}}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
						>
							Share
						</button>
					</div>
				</div>
			)}
		</main>
	);
}
