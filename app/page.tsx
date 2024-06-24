"use client";

// pages/index.tsx
import { useState } from "react";
import RepoInputForm from "../components/RepoInputForm";
import RepoContentDisplay from "../components/RepoContentDisplay";
import { fetchRepoContents } from "../utils/repoContentFetcher";

const Home: React.FC = () => {
	const [repoContents, setRepoContents] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleRepoSubmit = async (url: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const contents = await fetchRepoContents(url);
			setRepoContents(contents);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Git Repo to Text For LLM AI</h1>
			<RepoInputForm onSubmit={handleRepoSubmit} />
			{isLoading && <p>Loading repository contents...</p>}
			{error && <p className="text-red-500">{error}</p>}
			{repoContents && <RepoContentDisplay contents={repoContents} />}
		</main>
	);
};

export default Home;
