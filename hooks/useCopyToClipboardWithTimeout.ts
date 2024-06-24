import { useState, useEffect } from "react";
import { useCopyToClipboard } from "@uidotdev/usehooks";

export const useCopyToClipboardWithTimeout = (): [boolean, (value: string) => Promise<void>] => {
	const [isCopied, copyToClipboard] = useCopyToClipboard();
	const [isCopiedWithTimeout, setIsCopiedWithTimeout] = useState(false);

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;

		if (isCopied) {
			setIsCopiedWithTimeout(true);
			timeout = setTimeout(() => {
				setIsCopiedWithTimeout(false);
			}, 3000);
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [isCopied]);

	const copyToClipboardWithTimeout = (value: string) => {
		return copyToClipboard(value);
	};

	return [isCopiedWithTimeout, copyToClipboardWithTimeout];
};
