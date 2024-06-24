import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

const binaryExtensions = new Set([
	".exe",
	".dll",
	".so",
	".a",
	".lib",
	".dylib",
	".o",
	".obj",
	".zip",
	".tar",
	".gz",
	".rar",
	".7z",
	".iso",
	".bin",
	".pdf",
	".doc",
	".docx",
	".xls",
	".xlsx",
	".ppt",
	".pptx",
	".jpg",
	".jpeg",
	".png",
	".gif",
	".mp3",
	".mp4",
	".avi",
	".mov",
	".ico",
	// Add more binary extensions as needed
]);

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
			{ status: 500 }
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
		await execPromise(`git clone ${repoUrl} ${tempDir}`);
		const contents = await readFilesRecursively(tempDir);
		console.log(`Finished reading repository contents`);
		return contents;
	} catch (error) {
		console.error("Failed to clone and read repository", error);
		return "";
	} finally {
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
			if (file === ".git") continue;
			contents += await readFilesRecursively(filePath);
		} else {
			const ext = path.extname(file).toLowerCase();
			if (binaryExtensions.has(ext)) {
				contents += `---- ${path.relative("/tmp", filePath)}\n[Binary file, content not displayed]\n\n`;
			} else {
				try {
					const fileContent = await fs.promises.readFile(filePath, "utf-8");
					contents += `---- ${path.relative("/tmp", filePath)}\n${fileContent}\n\n`;
				} catch (error) {
					contents += `---- ${path.relative("/tmp", filePath)}\n[Error reading file: ${error}]\n\n`;
				}
			}
		}
	}

	return contents;
}
