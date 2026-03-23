import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("userTable", {
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
      subscription: "free",
    });
    return userId;
  },
});