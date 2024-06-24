import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

export async function GET(request: Request) {
	console.log("Received request to fetch repository contents");
	const { searchParams } = new URL(request.url);
	const repoUrl = searchParams.get("repoUrl");

	if (!repoUrl) {
		return Response.json({ message: "Missing repoUrl query parameter" }, { status: 400 });
	}

	try {
		const contents = await cloneAndReadRepo(repoUrl);
		return Response.json({ contents });
	} catch (error) {
		return new Response(
			`Failed to fetch repository contents: ${error instanceof Error ? error.message : String(error)}`,
			{
				status: 500,
			}
		);
	}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { url } = req.query;

	if (typeof url !== "string") {
		return res.status(400).json({ message: "Invalid URL parameter" });
	}

	try {
		const contents = await cloneAndReadRepo(url);
		res.status(200).json({ contents });
	} catch (error) {
		res.status(500).json({ message: "Error fetching repository contents" });
	}
}

async function cloneAndReadRepo(repoUrl: string): Promise<string> {
	const repoName = repoUrl.split("/").pop()?.replace(".git", "") || "temp-repo";
	const tempDir = path.join("/tmp", repoName);

	console.log(`Cloning repository ${repoUrl} to ${tempDir}`);

	try {
		// Clone the repository
		await execPromise(`git clone ${repoUrl} ${tempDir}`);

		// Read all files
		const contents = await readFilesRecursively(tempDir);

		console.log(`Finished reading repository contents`);
		console.log(contents);

		return contents;
	} catch (error) {
		console.error("Failed to clone and read repository", error);
		// Return an empty string or a default error message
		return "";
	} finally {
		// Clean up: remove the cloned repository
		await execPromise(`rm -rf ${tempDir}`);
	}
}

async function readFilesRecursively(dir: string): Promise<string> {
	let contents = "";
	const files = await fs.promises.readdir(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = await fs.promises.stat(filePath);

		if (stat.isDirectory()) {
			// Skip .git directory
			if (file === ".git") continue;
			contents += await readFilesRecursively(filePath);
		} else {
			const fileContent = await fs.promises.readFile(filePath, "utf-8");
			contents += `---- ${path.relative("/tmp", filePath)}\n${fileContent}\n\n`;
		}
	}

	return contents;
}