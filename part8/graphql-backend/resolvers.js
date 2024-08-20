const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

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

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;