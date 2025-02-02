import { NextResponse } from 'next/server';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => {  // ✅ Ensure correct function parameter
    // console.log("Incoming Request:", req); // ✅ Debugging log

    if (!req) {
      throw new Error("Request object is missing in context.");
    }

    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    let userId = null;

    if (token) {
      try {
        const decoded = verifyToken(token);
        userId = decoded?.userId || null;
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }

    // console.log("Extracted userId:", userId); // ✅ Debugging log
    return { prisma, userId };
  },
});




export async function GET(req: Request) {
  return handler(req);
}

export async function POST(req: Request) {
  return handler(req);
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
      'Access-Control-Allow-Headers': '*',
    },
  });
}