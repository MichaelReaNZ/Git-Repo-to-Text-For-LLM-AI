// components/RepoInputForm.tsx
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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
			<div className="space-y-2">
				<Input placeholder="Enter Git Repo URL Here" onChange={(e) => setUrl(e.target.value)} value={url} />
				<Button type="submit">Get Repo as Text</Button>
			</div>
		</form>
	);
};

export default RepoInputForm;
