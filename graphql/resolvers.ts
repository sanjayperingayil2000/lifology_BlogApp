import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateToken } from "@/utils/auth";

export const resolvers = {
  Query: {
    posts: async () => {
      try {
        return await prisma.post.findMany({ include: { author: true } }) || [];
      } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
      }
    },
    post: async (_, { id }) => {
      const postId = parseInt(id, 10);
      if (isNaN(postId)) {
        throw new Error("Invalid post ID");
      }
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
    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("Invalid credentials");

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) throw new Error("Invalid credentials");

      return generateToken(user.id);  // ✅ Returns a valid JWT
    },
    signup: async (_, { email, password, name }) => {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("Email already in use.");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
      });
      return generateToken(user.id);
    },
    createPost: async (_, { title, content, imageUrl }, { userId }) => {
      if (!userId) throw new Error("Unauthorized");
      return await prisma.post.create({
        data: { title, content, imageUrl, authorId: userId },
      });
    },
    updatePost: async (_, { id, title, content, imageUrl }, { userId }) => {
      if (!userId) throw new Error("Unauthorized");
    
      const post = await prisma.post.findUnique({ where: { id: parseInt(id, 10) } });
    
      if (!post || post.authorId !== userId) {
        throw new Error("Unauthorized: You can only edit your own posts.");
      }
    
      return await prisma.post.update({
        where: { id: parseInt(id, 10) },
        data: { title, content, imageUrl },
      });
    },    
    deletePost: async (_, { id }, { userId }) => {
      if (!userId) throw new Error("Unauthorized");
      await prisma.post.delete({ where: { id: parseInt(id, 10) } });
      return true;
    },
  },
};
