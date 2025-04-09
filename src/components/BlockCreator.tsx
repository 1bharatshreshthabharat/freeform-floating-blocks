
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

interface BlockCreatorProps {
  onCreateBlock: (content: string) => void;
}

export const BlockCreator: React.FC<BlockCreatorProps> = ({ onCreateBlock }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onCreateBlock(content);
      setContent("");
    }
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          placeholder="Enter block content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" className="flex items-center gap-1">
          <PlusCircle size={16} />
          <span>Add Block</span>
        </Button>
      </form>
    </div>
  );
};
