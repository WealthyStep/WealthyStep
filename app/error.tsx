"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-3xl font-bold text-navy mb-4">Something went wrong!</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred on our end.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[#82C341] text-white font-semibold rounded-xl hover:bg-[#72ad39] transition-colors shadow-sm"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="px-6 py-3 bg-white border border-gray-200 text-navy font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
