import { NextRequest, NextResponse } from "next/server";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    let userId: number | null = null;

    try {
      const authHeader = req.headers.get("authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const decoded = verifyToken(token);
        userId = decoded?.userId || null;
      }
    } catch (error) {
      console.error("Invalid token:", error instanceof Error ? error.message : "Unknown error");
    }

    return { prisma, userId };
  },
});

// Secure CORS - Allow only your frontend URL
const allowedOrigins = [
  "http://localhost:3000",  // Local Dev
  "https://lifology-blog-fylq738zy-sanjayperingayil2000s-projects.vercel.app",  // Production
];

export const GET = async (req: NextRequest) => {
  const response = await handler(req);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Origin", allowedOrigins.includes(req.headers.get("origin") || "") ? req.headers.get("origin")! : "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
};

export const POST = async (req: NextRequest) => {
  const response = await handler(req);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Origin", allowedOrigins.includes(req.headers.get("origin") || "") ? req.headers.get("origin")! : "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
};

// Ensure OPTIONS method is properly handled for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": allowedOrigins.includes(req.headers.get("origin") || "") ? req.headers.get("origin")! : "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,POST",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
