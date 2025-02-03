import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateToken } from "@/utils/auth";
import { Resolvers } from "@apollo/client";

// Define argument and context types
interface QueryArgs {
  id: string;
}

interface PostArgs {
  title: string;
  content: string;
  imageUrl?: string;
}

interface PostUpdateArgs extends PostArgs {
  id: string;
}

interface AuthArgs {
  email: string;
  password: string;
  name?: string;
}

interface Context {
  userId?: number | null;
}

export const resolvers: Resolvers = {
  Query: {
    posts: async (): Promise<any[]> => {
      try {
        return (await prisma.post.findMany({ include: { author: true } })) || [];
      } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
      }
    },
    post: async (_: unknown, { id }: QueryArgs): Promise<any | null> => {
      const postId = parseInt(id, 10);
      if (isNaN(postId)) throw new Error("Invalid post ID");

      try {
        return await prisma.post.findUnique({
          where: { id: postId },
          include: { author: true },
        });
      } catch (error) {
        console.error("Error fetching post:", error);
        return null;
      }
    },
  },
  Mutation: {
    login: async (_: unknown, { email, password }: AuthArgs): Promise<string> => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("Invalid credentials");

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) throw new Error("Invalid credentials");

      return generateToken(user.id);
    },

    signup: async (_: unknown, { email, password, name }: AuthArgs): Promise<string> => {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) throw new Error("Email already in use.");

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name: name || "Anonymous" },
      });

      return generateToken(user.id);
    },

    createPost: async (_: unknown, { title, content, imageUrl }: PostArgs, { userId }: Context): Promise<any> => {
      if (!userId) throw new Error("Unauthorized");

      return await prisma.post.create({
        data: { title, content, imageUrl, authorId: userId },
      });
    },

    updatePost: async (_: unknown, { id, title, content, imageUrl }: PostUpdateArgs, { userId }: Context): Promise<any> => {
      if (!userId) throw new Error("Unauthorized");

      const postId = parseInt(id, 10);
      const post = await prisma.post.findUnique({ where: { id: postId } });

      if (!post || post.authorId !== userId) {
        throw new Error("Unauthorized: You can only edit your own posts.");
      }

      return await prisma.post.update({
        where: { id: postId },
        data: { title, content, imageUrl },
      });
    },

    deletePost: async (_: unknown, { id }: QueryArgs, { userId }: Context): Promise<boolean> => {
      if (!userId) throw new Error("Unauthorized");

      const postId = parseInt(id, 10);
      const post = await prisma.post.findUnique({ where: { id: postId } });

      if (!post || post.authorId !== userId) {
        throw new Error("Unauthorized: You can only delete your own posts.");
      }

      await prisma.post.delete({ where: { id: postId } });
      return true;
    },
  },
};
