import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

const FILE_PREFIX = "⤂<#📂FilePath#>⤃ -"; //An unlikely occuring string for path we can split on

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
	".svg"
	// Add more binary extensions as needed
]);

export async function GET(request: Request) {
	
	console.log("Received request to fetch repository contents");
	const { searchParams } = new URL(request.url);
	const repoUrl = searchParams.get("repoUrl");
	const ignoreExtensionsAndFiles = searchParams.get("ignoreExtensionsAndFiles");

	console.log("ignoreExtensionsAndFiles", ignoreExtensionsAndFiles);

	if (!repoUrl || repoUrl.length === 0) {
		return Response.json({ message: "Missing repoUrl query parameter" }, { status: 400 });
	}

	try {
		const contents = await cloneAndReadRepo(repoUrl, searchParams.get("ignoreExtensionsAndFiles") ?? undefined);
		return Response.json({ contents });
	} catch (error) {
		return new Response(
			`Failed to fetch repository contents: ${error instanceof Error ? error.message : String(error)}`,
			{ status: 500 }
		);
	}
}

async function cloneAndReadRepo(repoUrl: string, ignoreExtensionsAndFiles?: string): Promise<string> {
	const repoName = repoUrl.split("/").pop()?.replace(".git", "") || "temp-repo";
	const tempDir = path.join("/tmp", repoName);

	console.log(`Cloning repository ${repoUrl} to ${tempDir}`);

	try {
		await execPromise(`git clone ${repoUrl} ${tempDir}`);
		const contents = await readFilesRecursively(tempDir, ignoreExtensionsAndFiles);
		console.log(`Finished reading repository contents`);
		return contents;
	} catch (error) {
		console.error("Failed to clone and read repository", error);
		return "";
	} finally {
		await execPromise(`rm -rf ${tempDir}`);
	}
}

async function readFilesRecursively(dir: string, ignoreExtensionsAndFiles?: string): Promise<string> {
	let contents = "";
	const files = await fs.promises.readdir(dir);

  // Split the ignoreExtensionsAndFiles string into an array, trim each item, and filter out empty strings
  const ignoreList = ignoreExtensionsAndFiles
    ? ignoreExtensionsAndFiles.split(",").map(item => item.trim()).filter(item => item !== "")
    : [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      if (file === ".git") continue;
      contents += await readFilesRecursively(filePath, ignoreExtensionsAndFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      const shouldIgnore = ignoreList.some(
        (item) => file.endsWith(item) || ext === `.${item}`
      );

			if (shouldIgnore) {
				// Skip this file
				continue;
			}

			if (binaryExtensions.has(ext)) {
				contents += `${FILE_PREFIX} ${path.relative("/tmp", filePath)}\n[Binary file, content not displayed]\n\n`;
			} else {
				try {
					const fileContent = await fs.promises.readFile(filePath, "utf-8");
					contents += `${FILE_PREFIX} ${path.relative("/tmp", filePath)}\n${fileContent}\n\n`;
				} catch (error) {
					contents += `${FILE_PREFIX} ${path.relative("/tmp", filePath)}\n[Error reading file: ${error}]\n\n`;
				}
			}
		}
	}

	return contents;
}
