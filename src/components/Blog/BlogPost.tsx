
import React from "react";
import { BlogPostType } from "./Blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, User, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogPostProps {
  post: BlogPostType;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const BlogPost: React.FC<BlogPostProps> = ({ post, onEdit, onDelete }) => {
  // Function to render markdown content
  const renderMarkdown = (content: string) => {
    // This is a simple implementation
    // In a real app, you would use a markdown parser like marked or remark
    return content.split('\n').map((line, i) => {
      // Handle headers
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.substring(3)}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-2xl font-bold mt-6 mb-3">{line.substring(2)}</h1>;
      }
      
      // Handle code blocks
      if (line.startsWith('```') && line.endsWith('```')) {
        return (
          <pre key={i} className="bg-gray-100 p-3 rounded my-3 overflow-x-auto">
            <code>{line.substring(3, line.length - 3)}</code>
          </pre>
        );
      }
      
      // Handle blank lines as paragraph breaks
      if (line === '') {
        return <br key={i} />;
      }
      
      // Default paragraph
      return <p key={i} className="my-2">{line}</p>;
    });
  };

  return (
    <div className="blog-post animate-fade-in">
      {post.imageUrl && (
        <div className="w-full h-60 mb-4 overflow-hidden rounded-lg">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        
        <div className="flex flex-wrap items-center text-sm text-gray-500 mt-3 gap-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{post.author}</span>
          </div>
          
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            <span>{post.category}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {(onEdit || onDelete) && (
          <div className="flex gap-2 mt-4">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                size="sm" 
                variant="outline" 
                className="text-destructive border-destructive hover:bg-destructive/10"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this post?')) {
                    onDelete();
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        )}
      </div>
      
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            {renderMarkdown(post.content)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
