import { TRPCError } from "@trpc/server";
// src/server/api/routers/guestbook.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const guestbookRouter = createTRPCRouter({
  postMessage: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.guestbook.create({
          data: {
            name: input.name,
            message: input.message,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "sorry",
          cause: error,
        });
      }
    }),
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.prisma.guestbook.findMany({
          take: (input?.limit ?? 10) + 1,
          skip:
            input?.page && input?.limit
              ? input.page * input.limit - input.limit
              : undefined,
          cursor: input?.cursor ? { id: input?.cursor } : undefined,
          select: {
            id: true,
            name: true,
            message: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        const length = await ctx.prisma.guestbook.count();
        const totalPage = input?.limit ? Math.ceil(length / input?.limit) : 1;
        let nextCursor: string | null | undefined = undefined;
        let isLast = totalPage <= (input?.page ?? 1)
        if (data.length > (input?.limit ?? 10)) {
          const nextItem = data.pop(); // return the last item from the array
          nextCursor = nextItem?.id;
        }else if(!input?.page){
          isLast = true
        }
        return {
          data,
          meta: {
            total: length,
            page: input?.page,
            totalPage,
            isLast: isLast,
            nextCursor,
          },
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "sorry",
          cause: error,
        });
      }
    }),
});
