import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Hash passwords
    const password1 = await bcrypt.hash('password123', 10);
    const password2 = await bcrypt.hash('securepass456', 10);

    // Create first user
    const user1 = await prisma.user.upsert({
      where: { email: 'user1@example.com' },
      update: {},
      create: {
        email: 'user1@example.com',
        password: password1,
        name: 'Alice Johnson',
      },
    });

    // Create second user
    const user2 = await prisma.user.upsert({
      where: { email: 'user2@example.com' },
      update: {},
      create: {
        email: 'user2@example.com',
        password: password2,
        name: 'Bob Smith',
      },
    });

    console.log('Users created:', user1, user2);

    // Sample post titles and descriptions
    const postData = [
      { title: 'Exploring GraphQL', content: 'GraphQL is a powerful alternative to REST.' },
      { title: 'Next.js for Beginners', content: 'A guide to starting with Next.js' },
      { title: 'Understanding Prisma', content: 'Learn how Prisma simplifies database management.' },
      { title: 'Deploying a Next.js App', content: 'Best practices for deploying on Vercel or AWS.' },
      { title: 'Server vs Client Components', content: 'How to choose between client-side and server-side rendering.' },
      { title: 'State Management in React', content: 'Using Redux, Zustand, or Context API.' },
      { title: 'GraphQL vs REST APIs', content: 'Why GraphQL might be a better choice than REST.' },
      { title: 'Database Transactions in Prisma', content: 'Ensuring atomicity in database operations.' },
      { title: 'Authentication in Next.js', content: 'JWT, OAuth, and NextAuth.js compared.' },
      { title: 'SEO Strategies for Next.js', content: 'Optimizing your app for search engines.' },
      { title: 'Using Apollo Client in React', content: 'A guide to GraphQL state management.' },
      { title: 'Image Optimization in Next.js', content: 'Using the Image component effectively.' },
      { title: 'Handling File Uploads', content: 'Uploading files with Next.js and S3.' },
      { title: 'Improving Performance', content: 'Performance tips for Next.js apps.' },
      { title: 'Error Handling Best Practices', content: 'How to properly handle errors in APIs.' },
    ];

    // Generate 15 posts for each user
    for (const user of [user1, user2]) {
      const posts = postData.map((post, index) => ({
        title: `${post.title} - ${index + 1}`,
        content: post.content,
        imageUrl: `https://picsum.photos/600/400?random=${index + 1}`,
        createdAt: new Date(), // Fix for 'Cannot return null for non-nullable field Post.createdAt'
        updatedAt: new Date(),
        authorId: user.id, // Use authorId to link the user
      }));

      await prisma.post.createMany({ data: posts });

      console.log(`Created 15 posts for ${user.name}`);
    }

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
