import prisma from '@/lib/prisma';

export const resolvers = {
  Query: {
    posts: async () => await prisma.post.findMany({ include: { author: true } }),
    post: async (_, { id }) => {
      // Convert id to integer before passing it to Prisma
      const postId = parseInt(id, 10);

      if (isNaN(postId)) {
        throw new Error("Invalid post ID");
      }

      return await prisma.post.findUnique({
        where: { id: postId },
        include: { author: true },
      });
    },
  },
  Mutation: {
    signup: async (_, { email, password, name }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
      });
      return generateToken(user.id);
    },
    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }
      return generateToken(user.id);
    },
    createPost: async (_, { title, content, imageUrl }, { userId }) => {
      if (!userId) throw new Error('Unauthorized');
      return await prisma.post.create({
        data: { title, content, imageUrl, authorId: userId },
        include: { author: true },
      });
    },
    updatePost: async (_, { id, title, content, imageUrl }, { userId }) => {
      if (!userId) throw new Error('Unauthorized');
      const postId = parseInt(id, 10); // Convert to integer

      if (isNaN(postId)) {
        throw new Error("Invalid post ID");
      }

      return await prisma.post.update({
        where: { id: postId },
        data: { title, content, imageUrl },
        include: { author: true },
      });
    },
    deletePost: async (_, { id }, { userId }) => {
      if (!userId) throw new Error('Unauthorized');
      const postId = parseInt(id, 10); // Convert to integer

      if (isNaN(postId)) {
        throw new Error("Invalid post ID");
      }

      await prisma.post.delete({ where: { id: postId } });
      return true;
    },
  },
};
