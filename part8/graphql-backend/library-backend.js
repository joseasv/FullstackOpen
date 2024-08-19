const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = `

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    allGenres: [String]
    me: User
  }

  type Mutation {
    addBook (
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(name: String, setBornTo: Int): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => {
      return Book.find({}).countDocuments();
    },
    authorCount: async () => {
      return Author.find({}).countDocuments();
    },
    allBooks: async (root, args) => {
      let result = null;
      /*if (args.author) {
        filteredBooks = filteredBooks.filter(
          (book) => book.author === args.author,
        );
      }*/

      if (args.genre) {
        result = await Book.find({ genres: args.genre }).populate("author", {
          name: 1,
          born: 1,
        });

        return result;
      }

      result = await Book.find({}).populate("author", {
        name: 1,
        born: 1,
      });
      console.log("allBooks ", result);

      return result;
    },
    allAuthors: async () => {
      const result = await Author.find({});
      console.log("allAuthors ", result);
      return result;
    },
    allGenres: async () => {
      const genres = await Book.find({})
        .select({ genres: 1, _id: 0 })
        .distinct("genres");
      return genres;
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: (root) => {
      const bookCount = books.reduce((count, book) => {
        if (book.author === root.name) {
          return count + 1;
        }
        return count;
      }, 0);
      return bookCount;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      console.log("root", root);
      console.log("args", args);

      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let authorInDB = await Author.findOne({ name: args.author });

      console.log("authorInDB find result ", authorInDB);

      if (authorInDB === null) {
        //authors = authors.concat({ name: args.author, id: uuid() });
        authorInDB = new Author({ name: args.author });
        try {
          await authorInDB.save();
        } catch (error) {
          throw new GraphQLError(
            "Saving author failed: Name should have more than 3 characters",
            {
              extensions: {
                code: "AUTHOR_NAME_MIN_LENGTH_4",
                invalidArgs: args.name,
                error,
              },
            },
          );
        }
      }

      console.log("authorInDB ", authorInDB);

      const book = new Book({ ...args, author: authorInDB });

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError(
          "Saving book failed: Book title should have more than 4 characters",
          {
            extensions: {
              code: "BOOK_TITLE_MIN_LENGTH_5",
              invalidArgs: args.name,
              error,
            },
          },
        );
      }

      console.log("saved book ", book);
      return book;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let authorInDB = await Author.findOne({ name: args.name }).exec();

      if (authorInDB === null) {
        return null;
      } else {
        authorInDB.born = args.setBornTo;
        authorInDB.save();
        return authorInDB;
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET,
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
