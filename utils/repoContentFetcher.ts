export const fetchRepoContents = async (url: string, ignoreExtensionsAndFiles: string): Promise<string> => {
	try {
		const response = await fetch(
			`http://localhost:3000/api/fetchRepo?repoUrl=${encodeURIComponent(
				url
			)}&ignoreExtensionsAndFiles=${encodeURIComponent(ignoreExtensionsAndFiles)}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data.contents;
	} catch (error) {
		console.error("Failed to fetch repository contents", error);
		throw new Error(`Failed to fetch repository contents: ${error instanceof Error ? error.message : String(error)}`);
	}
};
