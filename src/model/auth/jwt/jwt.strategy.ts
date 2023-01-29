// import { PassportStrategy } from "@nestjs/passport";
// import { Strategy } from "passport-jwt";
// import { ExtractJwt } from "passport-jwt";
// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";

// import * as dotenv from "dotenv";
// dotenv.config();

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     console.log(1);

//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (request) => request?.cookies?.JWT_COOKIE,
//       ]),
//       secretOrKey: new ConfigService().get("JWT_SECRET"),
//       ignoreExpiration: true,
//     });
//   }
// }
