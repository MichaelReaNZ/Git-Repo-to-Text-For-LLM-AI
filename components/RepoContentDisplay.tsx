// components/RepoContentDisplay.tsx
import React from "react";

interface RepoContentDisplayProps {
	contents: string;
}

const RepoContentDisplay: React.FC<RepoContentDisplayProps> = ({ contents }) => {
	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(contents);
	};

	return (
		<div>
			<div className="flex justify-between mb-2">
				<h2 className="text-xl font-semibold">Repository Contents</h2>
				<button onClick={handleCopyToClipboard} className="px-2 py-1 bg-gray-200 rounded">
					Copy to Clipboard
				</button>
			</div>
			<pre className="bg-gray-100 p-4 rounded overflow-x-auto text-black">{contents}</pre>
		</div>
	);
};

export default RepoContentDisplay;
