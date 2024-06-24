// components/RepoInputForm.tsx
import React, { useState } from "react";

interface RepoInputFormProps {
	onSubmit: (url: string) => void;
}

const RepoInputForm: React.FC<RepoInputFormProps> = ({ onSubmit }) => {
	const [url, setUrl] = useState<string>("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(url);
	};

	return (
		<form onSubmit={handleSubmit} className="mb-4">
			<input
				type="text"
				value={url}
				onChange={(e) => setUrl(e.target.value)}
				placeholder="Enter Git repository URL"
				className="w-full p-2 border rounded text-black"
			/>
			<button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
				Fetch Repository
			</button>
		</form>
	);
};

export default RepoInputForm;
