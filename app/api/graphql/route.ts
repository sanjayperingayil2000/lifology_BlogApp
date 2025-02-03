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

// ✅ Allow requests from all `lifology-blog` subdomains + localhost
const allowedOrigins = [
  "http://localhost:3000",
  "https://lifology-blog-app.vercel.app",
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;

  // ✅ Allow all `lifology-blog` subdomains on Vercel
  if (origin.endsWith(".vercel.app") && origin.includes("lifology-blog")) {
    return true;
  }

  // ✅ Allow explicitly listed domains
  return allowedOrigins.includes(origin);
}

// ✅ Set CORS Headers
function setCorsHeaders(req: NextRequest, response: NextResponse): void {
  const origin = req.headers.get("origin");

  if (origin && isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else {
    response.headers.set("Access-Control-Allow-Origin", "https://lifology-blog-app.vercel.app"); // ✅ Fallback
  }

  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS, POST");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

// ✅ Convert Response to NextResponse (Fix TypeScript Build Error)
async function createNextResponse(req: NextRequest): Promise<NextResponse> {
  const response = await handler(req);
  const nextResponse = new NextResponse(await response.text(), {
    status: response.status,
    headers: response.headers,
  });
  setCorsHeaders(req, nextResponse);
  return nextResponse;
}

// ✅ Fixed API Handlers (CORS applied dynamically)
export async function GET(req: NextRequest): Promise<NextResponse> {
  return createNextResponse(req);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return createNextResponse(req);
}

// ✅ CORS Preflight Request Handling
export async function OPTIONS(req: NextRequest): Promise<NextResponse> {
  const response = new NextResponse(null, { status: 204 });
  setCorsHeaders(req, response);
  return response;
}
