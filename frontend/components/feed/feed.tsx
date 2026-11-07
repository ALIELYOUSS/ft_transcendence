"use client";

import { useEffect, useState } from "react";
import { DiscoverPeople } from "./discover_people";
import { CreatePost } from "./create_post";
import { PostCard } from "./post_card";
import { MeetSlotCard } from "./MeetSlotCard";

interface BackendPost {
  id: string;
  content: string | null;
  imageUrl: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

interface UploadResponse {
  fileUrl: string;
}

export function Feed() {
  const [posts, setPosts] = useState<BackendPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Get posts from the backend.
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!API_URL) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured");
        }

        const response = await fetch(`${API_URL}/posts`);

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data: BackendPost[] = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Could not load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [API_URL]);

  // Create a post and optionally upload an image.
  const handleCreatePost = async (post: {
    caption: string;
    image: File | null;
  }) => {
    if (!API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not configured");
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Please login before creating a post.");
    }

    let imageUrl: string | null = null;

    // Upload image first if the user selected one.
    if (post.image) {
      const formData = new FormData();

      formData.append("file", post.image);
      formData.append("type", "posts");

      const uploadResponse = await fetch(`${API_URL}/uploads/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorMessage = await uploadResponse.text();
        console.error("Image upload error:", errorMessage);
        throw new Error("Image upload failed");
      }

      const uploadData: UploadResponse = await uploadResponse.json();
      imageUrl = uploadData.fileUrl;
    }

    // Create the post after the image upload.
    const postResponse = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: post.caption,
        imageUrl: imageUrl,
      }),
    });

    if (!postResponse.ok) {
      const errorMessage = await postResponse.text();
      console.error("Post creation error:", errorMessage);
      throw new Error("Post creation failed");
    }

    const newPost: BackendPost = await postResponse.json();

    setPosts((previousPosts) => [
      {
        ...newPost,
        _count: {
          likes: newPost._count?.likes ?? 0,
          comments: newPost._count?.comments ?? 0,
        },
      },
      ...previousPosts,
    ]);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-gray-900 pt-6 pb-16 flex justify-center px-4 sm:px-6">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <DiscoverPeople />

        <CreatePost onCreatePost={handleCreatePost} />

        {loading && (
          <p className="text-center text-gray-500">
            Loading posts...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          posts.map((post) => (
            <PostCard
              key={post.id}
              postId={post.id}
              caption={post.content ?? ""}
              imageUrl={post.imageUrl}
              username={post.user.username}
              initialLikes={post._count?.likes ?? 0}
              onDelete={(deletedPostId) => {
                setPosts((previousPosts) =>
                  previousPosts.filter(
                    (item) => item.id !== deletedPostId
                  )
                );
              }}
            />
          ))}

        <MeetSlotCard />
      </div>
    </main>
  );
}

