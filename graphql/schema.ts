export const typeDefs = `
  type User {
    id: Int!   
    email: String!
    name: String  
    posts: [Post!]!
  }

  type Post {
    id: Int!   
    title: String!
    content: String!
    imageUrl: String
    createdAt: String!
    author: User!
  }

  type Query {
    posts: [Post!]!
    post(id: Int!): Post   
  }

  type Mutation {
    signup(email: String!, password: String!, name: String): String
    login(email: String!, password: String!): String
    createPost(title: String!, content: String!, imageUrl: String): Post
    updatePost(id: Int!, title: String, content: String, imageUrl: String): Post
    deletePost(id: Int!): Boolean
  }
`;
