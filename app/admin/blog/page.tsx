"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminBlogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const posts = useQuery(api.blogPosts.listBlogPosts, {});
  const deletePost = useMutation(api.blogPosts.deleteBlogPost);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="default" className="bg-green-600">
            Published
          </Badge>
        );
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleDelete = async (postId: Id<"blogPosts">) => {
    try {
      await deletePost({ postId });
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button onClick={() => router.push("/admin/blog/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {posts ? (
        posts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title (EN)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell className="font-medium max-w-md truncate">
                    {post.titleEn}
                  </TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>{post.author?.name || "Unknown"}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(post.updatedAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {post.status === "published" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/blog/${post.slugEn}`)}
                          title="View post"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/blog/${post._id}/edit`)}
                        title="Edit post"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete post"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{post.titleEn}&quot;?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No blog posts yet</p>
            <Button onClick={() => router.push("/admin/blog/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first post
            </Button>
          </div>
        )
      ) : (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}
    </div>
  );
}
