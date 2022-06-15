import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { Column, Entity } from "typeorm";

// export class Name {
//   @Column()
//   first: string;

//   @Column()
//   last: string;
// }

@Entity("users")
export class UserEntity extends CommonEntity {
  @IsString({ message: "name : 문자열 형식으로 작성해주세요." })
  @IsNotEmpty({ message: "name : 공백을 남기지 말아주세요." })
  @Column({ type: "varchar", nullable: false })
  name: string;

  @IsString({ message: "nickName : 문자열 형식으로 작성해주세요." })
  @IsNotEmpty({ message: "nickName : 공백을 남기지 말아주세요." })
  @Column({ type: "varchar", unique: true, nullable: false })
  nickName: string;

  @IsString({ message: "birth : 문자열 형식으로 작성해주세요." })
  @IsNotEmpty({ message: "birth : 공백을 남기지 말아주세요." })
  @Column({ type: "varchar", unique: true, nullable: false })
  birth: string;

  @IsString({ message: "gender : 남성,여성 이외에 성별은 존재하지 않습니다." })
  @IsNotEmpty({ message: "gender : 공백을 남기지 말아주세요." })
  @Column({ type: "enum", enum: ["male", "female"] })
  gender: string;

  @IsEmail({ message: "email : email 형식으로 작성해주세요." })
  @IsNotEmpty({ message: "email : 공백을 남기지 말아주세요." })
  @Column({ type: "varchar", unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column({ type: "varchar", nullable: false })
  password: string;

  @IsString({ message: "phoneNumber : 문자열 형식으로 작성해주세요." })
  @IsNotEmpty({ message: "phoneNumber : 공백을 남기지 말아주세요." })
  @Column({ type: "varchar", unique: true, nullable: false })
  phoneNumber: string;

  @Column({ type: "smallint", default: 0 })
  point: number;

  @Column({
    type: "enum",
    enum: ["general", "special", "admin"],
    default: "general",
  })
  userType: string;
}
