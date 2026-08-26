import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-6">
        <SearchX size={32} />
      </div>
      <h2 className="text-3xl font-bold text-navy mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-[#82C341] text-white font-semibold rounded-xl hover:bg-[#72ad39] transition-colors shadow-sm"
      >
        Return Home
      </Link>
    </div>
  );
}
