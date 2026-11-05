

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
  imageUrl: string;
}

export function Feed() {
  const [posts, setPosts] = useState<BackendPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
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

  const handleCreatePost = async (post: {
    caption: string;
    image: File | null;
  }) => {
    let imageUrl: string | null = null;

    if (post.image) {
      const formData = new FormData();

      formData.append("file", post.image);
      formData.append("type", "posts");

      const uploadResponse = await fetch(`${API_URL}/uploads/image`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed");
      }

      const uploadData: UploadResponse = await uploadResponse.json();
      imageUrl = uploadData.imageUrl;
    }

    const postResponse = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: post.caption,
        imageUrl: imageUrl,
      }),
    });

    if (!postResponse.ok) {
      throw new Error("Post creation failed");
    }

    const newPost: BackendPost = await postResponse.json();

    const postWithCounts: BackendPost = {
      ...newPost,
      _count: {
        likes: 0,
        comments: 0,
      },
    };

    setPosts((previousPosts) => [postWithCounts, ...previousPosts]);
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

// "use client";

// import { useState} from "react";
// import { DiscoverPeople } from "./discover_people";
// import { CreatePost } from "./create_post";
// import { PostCard } from "./post_card";
// import { MeetSlotCard } from "./MeetSlotCard";

// interface NewPost {
//   id: string;
//   caption: string;
//   image: File | null;
// }

// export function Feed() {
//   const [posts, setPosts] = useState<NewPost[]>([]);

//   const handleCreatePost = (post: {
//     caption: string;
//     image: File | null;
//   }) => {
//     const newPost: NewPost = {
//       id: crypto.randomUUID(),
//       caption: post.caption,
//       image: post.image,
//     };

//     setPosts((previousPosts) => [newPost, ...previousPosts]);
//   };

//   return (
//     <main className="min-h-screen bg-[#F8F9FA] text-gray-900 pt-6 pb-16 flex justify-center px-4 sm:px-6">
//       <div className="w-full max-w-3xl flex flex-col gap-6">
//         <DiscoverPeople />

//         <CreatePost onCreatePost={handleCreatePost} />

//         {posts.map((post) => (
//           <PostCard
//             key={post.id}
//             caption={post.caption}
//             image={post.image}
//             showDefaultDetails={false}
//             initialLikes={0}
//           />
//         ))}

//         <PostCard />

//         <MeetSlotCard />
//       </div>
//     </main>
//   );
// }// import { DiscoverPeople } from "./discover_people";
// import { CreatePost } from "./create_post";
// import { PostCard } from './post_card';
// import { MeetSlotCard } from './MeetSlotCard';

// export function Feed() {
//   return (
//     <main className="min-h-screen bg-[#F8F9FA] text-gray-900 pt-6 pb-16 flex justify-center px-4 sm:px-6">
      
//       <div className="w-full max-w-3xl flex flex-col gap-6">
//         <DiscoverPeople />
//         <CreatePost />
//         <PostCard />
//         <MeetSlotCard />
//       </div>

//     </main>
//   );
// }
// import { FeedHeader } from "./header";
// import { DiscoverPeople } from "./discover_people";
// import { CreatePost } from "./create_post";
// import { PostCard } from './post_card';
// import { MeetSlotCard } from './MeetSlotCard';

// export function Feed() {
//     return (
//             <main className="max-w-2xl mx-auto w-full p-4 flex flex-col gap-4">
//                 <FeedHeader />
//                 <DiscoverPeople />
//                 <CreatePost />
//                 <PostCard />
//                 <MeetSlotCard/>
//             </main>
//     );
// }
