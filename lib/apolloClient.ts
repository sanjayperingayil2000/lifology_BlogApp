import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const GRAPHQL_URI =
  process.env.NEXT_PUBLIC_GRAPHQL_URI || "http://localhost:3000/api/graphql";

const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
  credentials: "include", // ✅ Ensures cookies & authentication work
});

const authLink = setContext((_, { headers }) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  }
  return { headers };
});

const client = new ApolloClient({
  ssrMode: typeof window === "undefined", // ✅ Improves SSR handling
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
