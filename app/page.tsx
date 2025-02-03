"use client";

import { gql, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import PostList from "@/app/components/PostList";
import Pagination from "@/app/components/Pagination";
import { useRouter } from "next/navigation";

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      imageUrl
      author {
        name
      }
      createdAt
    }
  }
`;

interface Post {
  id: number;
  title: string;
  imageUrl: string;
  author: {
    name: string;
  };
  createdAt: string;
}

export default function Home() {
  const { data, loading, error, refetch } = useQuery<{ posts: Post[] }>(GET_POSTS, {
    fetchPolicy: "network-only",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const postsPerPage = 16; // 4x4 grid
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const handleStorageChange = () => {
      refetch();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refetch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;
  if (!data || !data.posts.length) return <p className="text-center text-gray-500">No posts found.</p>;

  const filteredPosts = data.posts.filter((post: Post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="p-4 mx-[10%]">
      <h1 className="text-2xl font-bold mb-2">Blog Posts</h1>
      <p className="text-gray-600 italic">
        To create or edit posts, please sign up and log in.
      </p>
      <p className="text-gray-600 italic">
        <span className="font-medium">*</span> Only posts created by you can be edited by you.
      </p>
      
      <div className="flex justify-between items-center mb-4">
        <div className="mr-4">
          {token && (
            <button
              onClick={() => router.push("/create-post")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              + Create Post
            </button>
          )}
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded-lg w-[250px]"
          />
          <button
            className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
            onClick={() => setCurrentPage(1)}
          >
            Search
          </button>
        </div>
      </div>

      <PostList posts={paginatedPosts} />
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
