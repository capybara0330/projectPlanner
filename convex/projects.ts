import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

//returns all projects
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});

//returns a single project by its _id
export const get = query({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
    });
    return projectId;
  },
});

// modifies/updates the specified fields
export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: { name?: string; description?: string } = {};

    if (args.name !== undefined) {
      patch.name = args.name;
    }

    if (args.description !== undefined) {
      patch.description = args.description;
    }

    if (Object.keys(patch).length === 0) {
      throw new Error("No fields provided to update");
    }

    await ctx.db.patch("projects", args.id, patch);
  },
});

export const remove = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
