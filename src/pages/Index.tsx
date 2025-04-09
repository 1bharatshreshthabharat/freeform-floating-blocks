
import { useState } from "react";
import { DraggableBlock } from "@/components/DraggableBlock";
import { BlockCreator } from "@/components/BlockCreator";
import { FloatingBlocksContainer } from "@/components/FloatingBlocksContainer";
import { nanoid } from "nanoid";

export type Block = {
  id: string;
  content: string;
  position: { x: number; y: number };
  color: string;
};

const initialBlocks: Block[] = [
  {
    id: "block-1",
    content: "Drag me around!",
    position: { x: 100, y: 100 },
    color: "bg-blue-200",
  },
  {
    id: "block-2",
    content: "I'm also draggable!",
    position: { x: 300, y: 200 },
    color: "bg-green-200",
  },
  {
    id: "block-3",
    content: "Move me anywhere!",
    position: { x: 150, y: 300 },
    color: "bg-purple-200",
  },
];

const colors = [
  "bg-blue-200",
  "bg-green-200", 
  "bg-purple-200", 
  "bg-pink-200", 
  "bg-yellow-200", 
  "bg-teal-200"
];

const Index = () => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);

  const handleBlockMove = (id: string, position: { x: number; y: number }) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, position } : block
      )
    );
  };

  const addNewBlock = (content: string) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newBlock: Block = {
      id: nanoid(),
      content,
      position: { 
        x: Math.random() * (window.innerWidth * 0.6), 
        y: Math.random() * (window.innerHeight * 0.6) + 80 
      },
      color: randomColor,
    };

    setBlocks([...blocks, newBlock]);
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Freeform Floating Blocks
        </h1>
        
        <BlockCreator onCreateBlock={addNewBlock} />
        
        <FloatingBlocksContainer>
          {blocks.map((block) => (
            <DraggableBlock
              key={block.id}
              id={block.id}
              content={block.content}
              initialPosition={block.position}
              color={block.color}
              onMove={handleBlockMove}
              onDelete={() => deleteBlock(block.id)}
            />
          ))}
        </FloatingBlocksContainer>
      </div>
    </div>
  );
};

export default Index;
