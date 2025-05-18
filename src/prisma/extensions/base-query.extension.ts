import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const baseQueryExtension = Prisma.defineExtension({
  model: {
    user: {
      findByEmail: async (email: string) => {
        const context = Prisma.getExtensionContext(this) as any;
        return context.user.findFirstOrThrow({
          where: { email },
        });
      },
    },
    $allModels: {
      async updateIgnoreNotFound<T, A>(
        this: T,
        args: Prisma.Exact<A, Prisma.Args<T, 'update'>>,
      ): Promise<Prisma.Result<T, A, 'update'> | null> {
        try {
          const context = Prisma.getExtensionContext(this) as any;
          return await context.update(args);
        } catch (err) {
          if (
            err instanceof PrismaClientKnownRequestError &&
            err.code === 'P2025'
          ) {
            return null;
          }
          throw err;
        }
      },
      async deleteIgnoreNotFound<T, A>(
        this: T,
        args: Prisma.Exact<A, Prisma.Args<T, 'delete'>>,
      ): Promise<Prisma.Result<T, A, 'delete'> | null> {
        try {
          const context = Prisma.getExtensionContext(this) as any;
          return await context.delete(args);
        } catch (err) {
          if (
            err instanceof PrismaClientKnownRequestError &&
            err.code === 'P2025'
          ) {
            return null;
          }
          throw err;
        }
      },
    },
  },
});
