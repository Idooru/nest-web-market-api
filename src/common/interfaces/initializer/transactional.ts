import { QueryRunner } from "typeorm";

export abstract class Transactional<T> {
  abstract init(): Promise<QueryRunner>;
  abstract getRepository(): T;
}
