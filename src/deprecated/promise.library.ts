// import { Injectable } from "@nestjs/common";
// import { PromiseProcessor } from "./promises-processor";

// @Injectable()
// export class PromiseLibrary extends PromiseProcessor {
//   constructor() {
//     super();
//   }

//   async twoPromiseBundle<T, U>(
//     promiseOne: Promise<T>,
//     promiseTwo: Promise<U>,
//     msg: string,
//   ): Promise<[T, U]> {
//     const twoPromises = await Promise.allSettled([promiseOne, promiseTwo]);

//     return super.twoPromiseSettled(twoPromises[0], twoPromises[1], msg);
//   }

//   async threePromiseBundle<T, U, V>(
//     promiseOne: Promise<T>,
//     promiseTwo: Promise<U>,
//     promiseThree: Promise<V>,
//     msg: string,
//   ): Promise<[T, U, V]> {
//     const threePromises = await Promise.allSettled([
//       promiseOne,
//       promiseTwo,
//       promiseThree,
//     ]);

//     return super.threePromiseSettled(
//       threePromises[0],
//       threePromises[1],
//       threePromises[2],
//       msg,
//     );
//   }

//   async fourPromiseBundle<T, U, V, W>(
//     promiseOne: Promise<T>,
//     promiseTwo: Promise<U>,
//     promiseThree: Promise<V>,
//     promiseFour: Promise<W>,
//     msg: string,
//   ): Promise<[T, U, V, W]> {
//     const fourPromises = await Promise.allSettled([
//       promiseOne,
//       promiseTwo,
//       promiseThree,
//       promiseFour,
//     ]);

//     return super.fourPromiseSettled(
//       fourPromises[0],
//       fourPromises[1],
//       fourPromises[2],
//       fourPromises[3],
//       msg,
//     );
//   }
// }
