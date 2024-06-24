// components/RepoInputForm.tsx
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface RepoInputFormProps {
  onSubmit: (data: { url: string; ignoreExtensionsAndFiles: string }) => void;
}

const RepoInputForm: React.FC<RepoInputFormProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState<string>("");
  const [ignoreExtensionsAndFiles, setIgnoreExtensionsAndFiles] =
    useState<string>("");
  const [ignorePackageFiles, setIgnorePackageFiles] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const extensionsToIgnore = [
      ...ignoreExtensionsAndFiles.split(",").map((ext) => ext.trim()),
      ...(ignorePackageFiles ? ["package.json", "package-lock.json"] : []),
    ].join(",");

    onSubmit({ url, ignoreExtensionsAndFiles: extensionsToIgnore });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="space-y-2">
        <Input
          placeholder="Enter Git Repo URL Here"
          onChange={(e) => setUrl(e.target.value)}
          value={url}
        />
        <Input
          placeholder="[Optional] Enter file names & extensions to ignore (comma-separated) e.g `file.ts, .php, .config.ts`"
          onChange={(e) => setIgnoreExtensionsAndFiles(e.target.value)}
          value={ignoreExtensionsAndFiles}
        />
        <div className="flex items-center space-x-2 pl-0.5">
          <Checkbox
            id="ignorePackageFiles"
            onCheckedChange={(e) => setIgnorePackageFiles(!ignorePackageFiles)}
          />
          <label
            htmlFor="ignorePackageFiles"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ignore "package.json" and "package-lock.json"
          </label>
        </div>
        <Button type="submit" className="">
          Get Repo as Text
        </Button>
      </div>
    </form>
  );
};

export default RepoInputForm;
