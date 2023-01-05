const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
    Query: {
      me: async (parent, args, context) => {
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id })
            .select("-__v -password")
            // .populate("books");
  
          return userData;
        }
  
        throw new AuthenticationError("Not logged in");
      },
    },
    Mutation: {
      addUser: async (parent, args) => {
        try {
          const user = await User.create(args);
  
          const token = signToken(user);
          return { token, user };
        } catch (err) {
          console.log(err);
        }
      },
      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError("Incorrect credentials");
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError("Incorrect credentials");
        }
  
        const token = signToken(user);
        return { token, user };
      },
      saveBook: async (parent, args, context) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: args.input } },
            { new: true, runValidators: true }
          );
  
          return updatedUser;
        }
  
        throw new AuthenticationError("You need to be logged in!");
      },
      removeBook: async (parent, args, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: args.bookId } } },
            { new: true }
          );
  
          return updatedUser;
        }
  
        throw new AuthenticationError("You need to be logged in!");
      },
    },
  };
  
  module.exports = resolvers;