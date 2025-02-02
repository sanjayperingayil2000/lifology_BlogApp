import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Fetch all existing posts
    const posts = await prisma.post.findMany();
    
    // Update each post with the current timestamp if they don't have it
    for (const post of posts) {
      // Only update the post if the `createdAt` or `updatedAt` field is missing
      if (!post.createdAt || !post.updatedAt) {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            createdAt: post.createdAt || new Date(),
            updatedAt: post.updatedAt || new Date(),
          },
        });
        console.log(`Updated post ID: ${post.id}`);
      }
    }

    console.log('All posts updated successfully');
  } catch (error) {
    console.error('Error during update:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
