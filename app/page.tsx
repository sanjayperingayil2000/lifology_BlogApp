"use client";

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

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

export default function Home() {
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Blog Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.posts?.map((post: any) => {
          // Parse the createdAt date
          const createdAtDate = new Date(post.createdAt);

          // Check if the date is valid
          const isValidDate = !isNaN(createdAtDate.getTime());

          // Format the date only if it's valid
          const formattedDate = isValidDate
            ? createdAtDate.toLocaleDateString()
            : "Invalid Date";

          return (
            <Link key={post.id} href={`/blog/${post.id}`} className="block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-gray-600 text-sm mb-2">By {post.author.name}</p>
                  <p className="text-gray-500 text-xs mt-auto">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}