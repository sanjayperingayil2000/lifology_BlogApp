import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || "/api/graphql",
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

// ✅ Debug: Log all GraphQL operations before sending
const loggingLink = {
  request: async (operation, forward) => {
    console.log("📡 Sending GraphQL Request:", operation.operationName);
    console.log("📝 Variables:", operation.variables);
    return forward(operation);
  },
};

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
