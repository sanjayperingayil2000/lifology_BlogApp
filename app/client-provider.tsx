  "use client"; // Ensure this is present

  import { ApolloProvider } from '@apollo/client';
  import client from '@/lib/apolloClient';

  export default function ClientProvider({ children }: { children: React.ReactNode }) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
  }