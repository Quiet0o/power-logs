import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from './init'

import { TRPCError } from '@trpc/server'
import type { TRPCRouterRecord } from '@trpc/server'
import { db } from '#/db/index'
import { users } from '#/db/schema'
import { eq, and, ne } from 'drizzle-orm'

const todos = [
  { id: 1, name: 'Get groceries' },
  { id: 2, name: 'Buy a new phone' },
  { id: 3, name: 'Finish the project' },
]

const todosRouter = {
  list: publicProcedure.query(() => todos),
  add: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      const newTodo = { id: todos.length + 1, name: input.name }
      todos.push(newTodo)
      return newTodo
    }),
} satisfies TRPCRouterRecord

const usersRouter = {
  list: publicProcedure.query(async () => {
    return await db.select().from(users)
  }),
  add: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
      }),
    )
    .mutation(async ({ input }) => {
      // Check if email already exists
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1)
      if (existing.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Ten adres e-mail jest już zarejestrowany.',
        })
      }

      const [newUser] = await db
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
        })
        .returning()
      return newUser
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
      }),
    )
    .mutation(async ({ input }) => {
      // Check if email already exists for another user
      const existing = await db
        .select()
        .from(users)
        .where(and(eq(users.email, input.email), ne(users.id, input.id)))
        .limit(1)
      if (existing.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Ten adres e-mail jest już przypisany do innego konta.',
        })
      }

      const [updatedUser] = await db
        .update(users)
        .set({
          name: input.name,
          email: input.email,
        })
        .where(eq(users.id, input.id))
        .returning()
      return updatedUser
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const [deletedUser] = await db
        .delete(users)
        .where(eq(users.id, input.id))
        .returning()
      return deletedUser
    }),
} satisfies TRPCRouterRecord

export const trpcRouter = createTRPCRouter({
  todos: todosRouter,
  users: usersRouter,
})
export type TRPCRouter = typeof trpcRouter
