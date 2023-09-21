import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "first tweet",
    userId: "2",
  },
  {
    id: "2",
    text: "second tweet",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstname: "Nico",
    lastname: "Kim",
  },
  {
    id: "2",
    firstname: "Elon",
    lastname: "Mask",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstname: String!
    lastname: String!
    fullname: String!
  }
  type Tweet {
    id: ID
    text: String
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet]
    tweet(id: ID): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      console.log("allUsers called");
      return users;
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullname({ firstname, lastname }) {
      return `${firstname} ${lastname}`;
    },
  },
  Tweet: {
    author({ userId }) {
      const writeUser = users.find((user) => user.id === userId);

      if (!writeUser) throw new Error("유저를 찾을 수 없습니다.");

      return writeUser;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
