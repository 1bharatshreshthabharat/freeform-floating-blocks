
import React from "react";

interface FloatingBlocksContainerProps {
  children: React.ReactNode;
}

export const FloatingBlocksContainer: React.FC<FloatingBlocksContainerProps> = ({ 
  children 
}) => {
  return (
    <div className="relative min-h-[calc(100vh-200px)] w-full border-2 border-dashed border-gray-300 rounded-lg bg-white p-4 overflow-hidden">
      {children}
    </div>
  );
};
