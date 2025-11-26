import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  userTable: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),
    subscription: v.string(),
  }),
  TripDetailTable: defineTable({
    tripId: v.string(),
    tripDetail: v.any(),
    uid: v.id('userTable')
  }),
  messages: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    createdAt: v.number(),
  })
});