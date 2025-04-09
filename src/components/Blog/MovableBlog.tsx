
import React, { useState } from "react";
import { Blog, BlogPostType, UserRole } from "./Blog";

interface MovableBlogProps {
  initialPosts?: BlogPostType[];
  userRole?: UserRole;
  initialPosition?: { x: number; y: number };
}

export const MovableBlog: React.FC<MovableBlogProps> = ({
  initialPosts,
  userRole = "visitor",
  initialPosition = { x: 100, y: 100 }
}) => {
  const [position, setPosition] = useState(initialPosition);

  const handleMove = (newPosition: { x: number; y: number }) => {
    setPosition(newPosition);
  };

  return (
    <Blog
      initialPosts={initialPosts}
      userRole={userRole}
      position={position}
      onMove={handleMove}
    />
  );
};

export default MovableBlog;
