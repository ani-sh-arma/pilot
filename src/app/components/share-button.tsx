import { Share } from "lucide-react";
import React from "react";
import { getErrorMessage } from "~/lib/utils/error-handling";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
        console.log("Shared successfully!");
      } catch (error) {
        console.error("Sharing failed:", getErrorMessage(error));
        if (error instanceof Error ? error.name === "AbortError" : false) {
          console.log("Sharing aborted."); // User cancelled the share
        }
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert(
        "Web Share API is not supported in this browser. Copy the URL to share: " +
          url,
      );
      navigator.clipboard
        .writeText(url)
        .then(() => {
          console.log("URL copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy URL: ", err);
        });
    }
  };

  return (
    <button
      className="flex w-full items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
      onClick={handleShare}
    >
      <Share className="mr-2 h-4 w-4" />
      Share
    </button>
  );
};

export default ShareButton;
