
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface DraggableBlockProps {
  id: string;
  content: string;
  initialPosition: { x: number; y: number };
  color: string;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onDelete: () => void;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  id,
  content,
  initialPosition,
  color,
  onMove,
  onDelete,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef(position);

  // Update ref when position changes
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Report position changes to parent
  useEffect(() => {
    onMove(id, position);
  }, [position, id, onMove]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent text selection during drag
    e.preventDefault();
    
    // Don't start drag if clicking the delete button
    if ((e.target as HTMLElement).closest(".delete-button")) {
      return;
    }
    
    setIsDragging(true);
    dragStartRef.current = { 
      x: e.clientX - positionRef.current.x, 
      y: e.clientY - positionRef.current.y 
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't start drag if touching the delete button
    if ((e.target as HTMLElement).closest(".delete-button")) {
      return;
    }
    
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartRef.current = { 
      x: touch.clientX - positionRef.current.x, 
      y: touch.clientY - positionRef.current.y 
    };
    
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    };
    
    setPosition(newPosition);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const newPosition = {
      x: touch.clientX - dragStartRef.current.x,
      y: touch.clientY - dragStartRef.current.y,
    };
    
    setPosition(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };

  return (
    <div
      ref={blockRef}
      className={`absolute ${color} p-4 rounded-lg shadow-md cursor-move ${
        isDragging ? "shadow-lg z-50" : "z-10"
      } transition-shadow`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: "200px",
        touchAction: "none", // Prevents browser handling of touch events
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="flex justify-between items-start">
        <div className="w-full pr-6">{content}</div>
        <button 
          className="delete-button text-gray-500 hover:text-red-500 transition-colors"
          onClick={onDelete}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
