import { PrismaClient } from '@prisma/client';
import { pagination } from 'prisma-extension-pagination';
import prismaRandom from 'prisma-extension-random';
import { baseQueryExtension } from './extensions/base-query.extension';
import { existsExtension } from './extensions/exists.extension';
import { findManyAndCountExtension } from './extensions/find-many-count.extension';

function extendClient(base: PrismaClient) {
  // Add as many as you'd like - no ugly types required!
  return base
    .$extends(existsExtension)
    .$extends(findManyAndCountExtension)
    .$extends(baseQueryExtension)
    .$extends(pagination())
    .$extends(prismaRandom());
}

class UntypedExtendedClient extends PrismaClient {
  constructor(options?: ConstructorParameters<typeof PrismaClient>[0]) {
    super(options);

    return extendClient(this) as this;
  }
}

const ExtendedPrismaClient = UntypedExtendedClient as unknown as new (
  options?: ConstructorParameters<typeof PrismaClient>[0],
) => ReturnType<typeof extendClient>;

export { ExtendedPrismaClient };
