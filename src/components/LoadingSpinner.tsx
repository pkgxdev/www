import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]" role="status">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-[#4156E1] rounded-full animate-spin"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
