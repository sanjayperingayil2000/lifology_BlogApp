"use client";

import { gql, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";

const GET_POST = gql`
  query GetPost($id: Int!) {
    post(id: $id) {
      id
      title
      imageUrl
      createdAt
      content  # This should match the fields you want to fetch
    }
  }
`;

const BlogPost = () => {
  const params = useParams();

  // Ensure `id` is parsed as an integer
  const postId = params?.id ? parseInt(params.id, 10) : null;

  const { data, loading, error } = useQuery(GET_POST, {
    skip: !postId, // Prevents sending invalid requests
    variables: { id: postId }, // Pass `id` as integer to match GraphQL type
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("GraphQL Error:", error); // Debug: Log full error
    return <p>Error: {error.message}</p>;
  }
  if (!data || !data.post) return <p>No post found.</p>;

  // Ensure date is formatted correctly
  const formattedDate = data?.post?.createdAt
    ? new Date(data.post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown Date";

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{data.post.title}</h1>
      {data.post.imageUrl && (
        <img
          src={data.post.imageUrl}
          alt={data.post.title}
          className="w-full h-64 object-cover mt-4"
        />
      )}
      <p className="text-gray-500 mt-2">Published on: {formattedDate}</p>
      <p className="text-gray-600 mt-2">{data.post.content}</p> {/* Render content */}
    </div>
  );
};

export default BlogPost;
