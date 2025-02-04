"use client";

import { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

const GET_POST = gql`
  query GetPost($id: Int!) {
    post(id: $id) {
      id
      title
      content
      imageUrl
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id)
  }
`;

export default function BlogPost() {
  const { id } = useParams();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const { data, loading } = useQuery(GET_POST, {
    skip: !id, 
    variables: { id: id ? parseInt(id as string, 10) : undefined },
  });

  const [deletePost] = useMutation(DELETE_POST);

  const handleDelete = async () => {
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePost({ variables: { id: id ? parseInt(id as string, 10) : undefined } });
      router.push("/");
    } catch (error) {
      alert("Unauthorized: You can only delete your own post");
      console.log(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!data?.post) return <p>Post not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{data.post.title}</h1>
      {data.post.imageUrl && (
        <Image
          src={data.post.imageUrl}
          alt={data.post.title}
          width={800}
          height={500}
          unoptimized
          className="w-full h-64 object-cover mt-4"
        />
      )}
      <p className="text-gray-600 mt-2">{data.post.content}</p>

      {isLoggedIn && (
        <div className="flex justify-between mt-4">
          <button onClick={() => router.push(`/edit-post/${id}`)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Edit
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg">
            Delete
          </button>
        </div>
      )}

      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">Are you sure you want to delete this post?</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                Yes
              </button>
              <button onClick={() => setIsDeleting(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
