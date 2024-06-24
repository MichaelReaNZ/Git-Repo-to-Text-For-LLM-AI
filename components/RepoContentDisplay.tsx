import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyToClipboardWithTimeout } from "@/hooks/useCopyToClipboardWithTimeout";

type CardProps = React.ComponentProps<typeof Card>;

export function RepoContentDisplay({
	repoPlainTextContent,
	className,
	...props
}: CardProps & { repoPlainTextContent: string }) {
	const [isCopiedWithTimeout, copyToClipboardWithTimeout] = useCopyToClipboardWithTimeout();

	const onCopy = () => {
		copyToClipboardWithTimeout(repoPlainTextContent);
	};

	return (
		<Card className={cn("", className)} {...props}>
			<CardHeader>
				<div className="flex justify-between">
					<CardTitle className="text-xl">Repository Contents</CardTitle>
					<Button variant="outline" size="sm" className="text-xs" onClick={onCopy}>
						{isCopiedWithTimeout ? <CheckIcon className="pr-2 size-6" /> : <CopyIcon className="pr-2 size-6" />}
						{isCopiedWithTimeout ? "Copied!" : "Copy Whole Entire Repo"}
					</Button>
				</div>
			</CardHeader>
			<CardContent className="grid gap-4 overflow-x-auto">
				<pre className="p-4 rounded overflow-x-auto">{repoPlainTextContent}</pre>
			</CardContent>
		</Card>
	);
}
