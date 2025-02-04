"use client";

import { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter, useParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $imageUrl: String) {
    createPost(title: $title, content: $content, imageUrl: $imageUrl) {
      id
      title
      content
      imageUrl
    }
  }
`;

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      imageUrl
      author {
        name
        id
      }
      createdAt
    }
  }
`;

const GET_POST = gql`
  query GetPost($id: Int!) {
    post(id: $id) {
      id
      title
      content
      imageUrl
      author {
        id
      }
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: Int!, $title: String!, $content: String!, $imageUrl: String) {
    updatePost(id: $id, title: $title, content: $content, imageUrl: $imageUrl) {
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

interface PostFormData {
  title: string;
  content: string;
  imageUrl?: string;
}

export default function PostForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PostFormData>();
  const [createPost] = useMutation(CREATE_POST, { refetchQueries: [{ query: GET_POSTS }] });
  const [updatePost] = useMutation(UPDATE_POST, { refetchQueries: [{ query: GET_POSTS }] });
  const [deletePost] = useMutation(DELETE_POST, { refetchQueries: [{ query: GET_POSTS }] });
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const { data, loading, refetch } = useQuery(GET_POST, {
    skip: !isEditing,
    variables: { id: id ? parseInt(id as string, 10) : 0 },
    onCompleted: (data) => {
      if (data?.post) {
        setValue("title", data.post.title);
        setValue("imageUrl", data.post.imageUrl);
        setValue("content", data.post.content);
      }
    },
  });

  const onSubmit: SubmitHandler<PostFormData> = async (formData) => {
    try {
      if (isEditing) {
        await updatePost({ variables: { id: parseInt(id as string, 10), ...formData } });
      } else {
        await createPost({ variables: { ...formData } });
      }
      refetch();
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Unauthorized: You can only edit your own postsError saving post");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePost({ variables: { id: parseInt(id as string, 10) } });
      window.dispatchEvent(new Event("storage"));
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Unauthorized: You can only delete your own post");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">{isEditing ? "Edit Post" : "Create Post"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("title", { required: "Title is required" })} type="text" placeholder="Title" className="w-full p-2 border rounded-lg" />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

          <input {...register("imageUrl")} type="text" placeholder="Image URL" className="w-full p-2 border rounded-lg" />

          <textarea {...register("content", { required: "Content is required" })} placeholder="Content" className="w-full p-2 border rounded-lg" />
          {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}

          <div className="flex justify-between">
            <button type="button" onClick={() => router.push("/")} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">{isEditing ? "Update" : "Submit"}</button>
          </div>
          {isEditing && userId === data?.post?.author?.id && (
            <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg w-full mt-4">Delete Post</button>
          )}
        </form>
      </div>
      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">Are you sure you want to delete this post?</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg">Yes</button>
              <button onClick={() => setIsDeleting(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
