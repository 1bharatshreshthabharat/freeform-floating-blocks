
import React from "react";
import { BlogPostType, UserRole } from "./Blog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";

interface BlogListProps {
  posts: BlogPostType[];
  onSelectPost: (postId: string) => void;
  onEditPost?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  userRole: UserRole;
}

export const BlogList: React.FC<BlogListProps> = ({
  posts,
  onSelectPost,
  onEditPost,
  onDeletePost,
  userRole
}) => {
  const canManagePosts = userRole === "admin" || userRole === "editor";
  const publishedPosts = canManagePosts ? posts : posts.filter(post => post.published);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {publishedPosts.map((post) => (
          <Card 
            key={post.id} 
            className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col"
          >
            {post.imageUrl && (
              <div className="w-full h-40 overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold line-clamp-2">{post.title}</CardTitle>
                {!post.published && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    Draft
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pb-2 flex-grow">
              <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between items-center text-sm text-gray-500">
              <div>
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{post.author}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onSelectPost(post.id)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
                {canManagePosts && onEditPost && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPost(post.id);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                )}
                {canManagePosts && onDeletePost && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this post?')) {
                        onDeletePost(post.id);
                      }
                    }}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {publishedPosts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No posts available.</p>
        </div>
      )}
    </div>
  );
};
