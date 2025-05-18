import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { DEFAULT_USER_RELATIONS, IS_PUBLIC_KEY } from "../constants";
import { convertArrayStringsToNestedObject } from "../utils";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthUser } from "../../@types";

// const ALLOWED_PATHS = ["/auth/me"];

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
  constructor(
    private readonly prismaService: PrismaService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    if (isPublic && !request.headers.authorization) {
      return true;
    }

    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    const relations = [...DEFAULT_USER_RELATIONS];
    if (request.query.fields) {
      const fields = request.query.fields
        .toString()
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
      fields.forEach((f) => {
        const fieldRelation = f.split(".");
        const lastRelation = fieldRelation[0];

        if (DEFAULT_USER_RELATIONS.includes(lastRelation)) {
          relations.push(f);
        }
      });
    }

    const transformedRelations = convertArrayStringsToNestedObject(
      relations,
      true,
    );

    /* if (!ALLOWED_PATHS.includes(request.path)) {
      relations =
        this.reflector.getAllAndOverride<string[] | undefined>(
          APPLY_USER_RELATIONS,
          [context.getHandler(), context.getClass()],
        ) || DEFAULT_USER_RELATIONS;

      transformedRelations = convertArrayStringsToNestedObject(relations, true);
    }*/

    const user = await this.prismaService.user.findFirstOrThrow({
      where: { id: request.user.id },
      omit: { password: true },
      include:
        Object.keys(transformedRelations).length > 0
          ? transformedRelations
          : undefined,
    });

    if (!user) {
      throw new Error();
    }

    request.user = user as unknown as AuthUser;

    return true;
  }
}
