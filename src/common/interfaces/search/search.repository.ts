import { BaseEntity, SelectQueryBuilder } from "typeorm";
import { loggerFactory } from "../../functions/logger.factory";
import { InternalServerErrorException } from "@nestjs/common";

export abstract class SearchRepository<E, D, R> {
  abstract findPureEntity(args: FindPureEntityArgs): Promise<E | E[]>;
  abstract findOptionalEntity(args: FindOptionalEntityArgs): Promise<E | E[]>;
  abstract findAllRaws(dto: D | D[]): Promise<R[]>;

  protected joinEntity(entities: (typeof BaseEntity)[], query: SelectQueryBuilder<E>, select: string): void {
    const targetEntity = `${select.charAt(0).toUpperCase() + select.slice(1)}Entity`;
    entities.forEach((entity) => {
      const entityName = entity.name.replace("Entity", "");
      try {
        query.leftJoinAndSelect(`${select}.${entityName}`, entityName);
      } catch (err) {
        if (err.message.includes("entity was not found")) {
          const message = `${entityName}Entity는 ${targetEntity}와 연간관계가 없습니다.`;
          loggerFactory(`None Relation With ${targetEntity}`).error(message);
          throw new InternalServerErrorException(message);
        } else {
          const message = err.message;
          loggerFactory("Unexpected Exception").error(message);
          throw new InternalServerErrorException(message);
        }
      }
    });
  }

  protected getEntity(getOne: boolean, query: SelectQueryBuilder<E>): Promise<E | E[]> {
    return getOne ? query.getOne() : query.getMany();
  }
}

export class FindPureEntityArgs {
  property: string;
  alias: unknown;
  getOne: boolean;
}

export class FindOptionalEntityArgs {
  property: string;
  alias: unknown;
  entities: (typeof BaseEntity)[];
  getOne: boolean;
}
