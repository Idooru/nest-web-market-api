import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'shere12345!',
  database: 'nestWebMarket_API',
  entities: ['dist/**/*.entity.{ts,js}'],
  synchronize: true,
};
