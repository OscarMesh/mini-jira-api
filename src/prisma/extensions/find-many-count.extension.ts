import { Prisma } from "@prisma/client";

// export type FindManyAndCountResult<TModel, TArgs> = ReturnType<
//   typeof findManyAndCountExtension<TModel, TArgs>
// >["model"]["$allModels"]["findManyAndCount"];

export const findManyAndCountExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: "findManyAndCount",
    model: {
      $allModels: {
        async findManyAndCount<
          TModel,
          TArgs extends Prisma.Args<TModel, "findMany">,
        >(
          this: TModel,
          args?: Prisma.Exact<TArgs, Prisma.Args<TModel, "findMany">>,
        ) {
          const context = Prisma.getExtensionContext(this);

          const [records, totalRecords] = await client.$transaction([
            (context as any).findMany(args),
            (context as any).count({ where: (args as any)?.where }),
          ]);

          const take = (args as any)?.take;
          let totalPages = totalRecords === 0 ? 0 : 1;

          if (take === 0) {
            totalPages = 0;
          } else if (typeof take === "number") {
            totalPages = Math.ceil(totalRecords / take);
          }

          return [records, totalRecords, totalPages];
        },
      },
    },
  });
});
