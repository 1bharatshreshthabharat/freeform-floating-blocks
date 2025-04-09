
import React, { useState } from "react";
import { BlogList } from "./BlogList";
import { BlogPost } from "./BlogPost";
import { BlogEditor } from "./BlogEditor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";

export type BlogPostType = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: Date;
  tags: string[];
  category: string;
  imageUrl?: string;
  published: boolean;
};

export type UserRole = "admin" | "editor" | "visitor";

interface BlogProps {
  initialPosts?: BlogPostType[];
  userRole?: UserRole;
  position?: { x: number; y: number };
  onMove?: (position: { x: number; y: number }) => void;
}

export const Blog: React.FC<BlogProps> = ({
  initialPosts = [],
  userRole = "visitor",
  position = { x: 100, y: 100 },
  onMove
}) => {
  const [posts, setPosts] = useState<BlogPostType[]>(initialPosts.length ? initialPosts : samplePosts);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);
  const { toast } = useToast();

  const canManagePosts = userRole === "admin" || userRole === "editor";
  
  const selectedPost = selectedPostId
    ? posts.find((post) => post.id === selectedPostId)
    : null;

  const handleCreatePost = () => {
    setSelectedPostId(null);
    setIsEditing(true);
  };

  const handleEditPost = (postId: string) => {
    setSelectedPostId(postId);
    setIsEditing(true);
  };

  const handleSavePost = (post: BlogPostType) => {
    if (post.id) {
      // Update existing post
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === post.id ? post : p))
      );
      toast({
        title: "Post updated",
        description: "Your post has been updated successfully."
      });
    } else {
      // Create new post
      const newPost = {
        ...post,
        id: nanoid(),
        date: new Date(),
        author: "Current User", // This would come from authentication in a real app
      };
      setPosts((prevPosts) => [...prevPosts, newPost]);
      toast({
        title: "Post created",
        description: "Your post has been created successfully."
      });
    }
    setIsEditing(false);
    setSelectedPostId(null);
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    if (selectedPostId === postId) {
      setSelectedPostId(null);
    }
    toast({
      title: "Post deleted",
      description: "Your post has been deleted successfully.",
      variant: "destructive"
    });
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (!canManagePosts) return;
    setIsDragging(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newX = currentPosition.x + (e.clientX - startX);
      const newY = currentPosition.y + (e.clientY - startY);
      setCurrentPosition({ x: newX, y: newY });
      
      if (onMove) {
        onMove({ x: newX, y: newY });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleBackToList = () => {
    setSelectedPostId(null);
    setIsEditing(false);
  };

  return (
    <div 
      className="blog-component" 
      style={{ 
        position: 'absolute',
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        width: '800px',
        maxWidth: '90vw'
      }}
    >
      <Card className="shadow-lg overflow-hidden">
        <div 
          className={`bg-primary text-primary-foreground p-4 flex justify-between items-center ${canManagePosts ? 'cursor-move' : ''}`}
          onMouseDown={canManagePosts ? handleDragStart : undefined}
        >
          <h2 className="text-xl font-bold">Blog System</h2>
          {canManagePosts && !isEditing && !selectedPostId && (
            <Button 
              size="sm" 
              onClick={handleCreatePost}
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-1" /> New Post
            </Button>
          )}
          {(isEditing || selectedPostId) && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleBackToList}
              className="bg-white text-primary hover:bg-gray-100"
            >
              Back to List
            </Button>
          )}
        </div>

        <div className="p-4">
          {!isEditing && !selectedPostId && (
            <BlogList 
              posts={posts} 
              onSelectPost={setSelectedPostId} 
              onEditPost={canManagePosts ? handleEditPost : undefined}
              onDeletePost={canManagePosts ? handleDeletePost : undefined}
              userRole={userRole}
            />
          )}

          {!isEditing && selectedPostId && selectedPost && (
            <BlogPost 
              post={selectedPost} 
              onEdit={canManagePosts ? () => handleEditPost(selectedPost.id) : undefined}
              onDelete={canManagePosts ? () => handleDeletePost(selectedPost.id) : undefined}
            />
          )}

          {isEditing && (
            <BlogEditor 
              post={selectedPost} 
              onSave={handleSavePost} 
              onCancel={handleBackToList}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

// Sample posts for demonstration
const samplePosts: BlogPostType[] = [
  {
    id: "1",
    title: "Getting Started with React",
    content: "React is a JavaScript library for building user interfaces. It's declarative, efficient, and flexible. React makes it painless to create interactive UIs.\n\n## Why React?\n\nReact allows you to build encapsulated components that manage their own state, then compose them to make complex UIs.\n\n```jsx\nfunction HelloWorld() {\n  return <h1>Hello, world!</h1>;\n}\n```",
    excerpt: "Learn the basics of React and why it's one of the most popular front-end libraries.",
    author: "Jane Doe",
    date: new Date("2023-05-15"),
    tags: ["React", "JavaScript", "Frontend"],
    category: "Development",
    published: true
  },
  {
    id: "2",
    title: "Responsive Design Best Practices",
    content: "Responsive web design makes your web page look good on all devices. It uses HTML and CSS to resize, hide, shrink, enlarge, or move the content to make it look good on any screen.\n\n## Mobile-First Approach\n\nDesigning for mobile first forces you to focus on the essential content and functionality.",
    excerpt: "Tips for creating websites that work well on any device size.",
    author: "John Smith",
    date: new Date("2023-06-20"),
    tags: ["CSS", "Responsive", "Design"],
    category: "UI/UX",
    imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    published: true
  },
  {
    id: "3",
    title: "Introduction to TypeScript",
    content: "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.\n\n## Why TypeScript?\n\nTypeScript adds additional syntax to JavaScript to support a tighter integration with your editor. It helps catch errors early in your editor and provides better documentation of your code.\n\n```typescript\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n```",
    excerpt: "Learn how TypeScript enhances JavaScript with static types and more.",
    author: "Alice Johnson",
    date: new Date("2023-07-10"),
    tags: ["TypeScript", "JavaScript", "Programming"],
    category: "Development",
    published: true
  }
];

export default Blog;
