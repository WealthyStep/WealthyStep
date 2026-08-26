export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#82C341] rounded-full border-t-transparent animate-spin"></div>
        <img src="/icon.png" alt="Loading" className="w-6 h-6 object-contain animate-pulse" />
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 tracking-wider uppercase animate-pulse">Loading...</p>
    </div>
  );
}
