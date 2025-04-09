
import React, { useState } from "react";
import { BlogPostType } from "./Blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Image, Tag as TagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogEditorProps {
  post?: BlogPostType | null;
  onSave: (post: BlogPostType) => void;
  onCancel: () => void;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  post,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [category, setCategory] = useState(post?.category || "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || "");
  const [published, setPublished] = useState(post?.published || false);
  
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(post?.tags || []);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    
    if (!content.trim()) {
      alert("Please enter content");
      return;
    }

    const updatedPost: BlogPostType = {
      id: post?.id || "",
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || title.trim(),
      author: post?.author || "Current User", // In a real app, get from auth context
      date: post?.date || new Date(),
      tags,
      category: category.trim() || "Uncategorized",
      imageUrl: imageUrl.trim() || undefined,
      published,
    };

    onSave(updatedPost);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>{post ? "Edit Post" : "Create New Post"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of the post"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here (supports Markdown)"
              rows={10}
              required
            />
            <p className="text-xs text-gray-500">
              Supports Markdown: # Header, ## Subheader, ```code```
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Technology, Lifestyle"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <div className="flex">
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="rounded-r-none"
                />
                <Button 
                  type="button"
                  variant="outline" 
                  className="rounded-l-none border-l-0"
                  onClick={() => {
                    // In a real app, you would open an image picker/uploader here
                    alert("Image upload functionality would be implemented here");
                  }}
                >
                  <Image className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex">
              <div className="flex-grow flex items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                <TagIcon className="h-4 w-4 mr-2 text-gray-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag"
                  className="flex-grow bg-transparent focus:outline-none text-sm"
                />
              </div>
              <Button 
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className="ml-2"
              >
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published">Publish this post</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="gap-1">
            <Save className="h-4 w-4" />
            Save Post
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
