"use client";

// pages/index.tsx
import { useState } from "react";
import RepoInputForm from "../components/RepoInputForm";

import { fetchRepoContents } from "../utils/repoContentFetcher";
import { RepoContentDisplay } from "@/components/RepoContentDisplay";

const Home: React.FC = () => {
	const [repoContents, setRepoContents] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleRepoSubmit = async (data: { url: string; ignoreExtensionsAndFiles: string }) => {
		setIsLoading(true);
		setError(null);
		try {
			const contents = await fetchRepoContents(data.url, data.ignoreExtensionsAndFiles);
			setRepoContents(contents);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};
	return (
			<main className="container mx-auto p-8">
			<h1 className="text-2xl font-bold mb-4">Git Repo to Text For LLM AI</h1>
			<RepoInputForm onSubmit={handleRepoSubmit} />
			{isLoading && <p>Loading repository contents... (This can take some time)</p>}
			{error && <p className="text-red-500">{error}</p>}
			{repoContents && <RepoContentDisplay className="w-full" repoPlainTextContent={repoContents} />}
		</main>
	);
	
};

export default Home;
