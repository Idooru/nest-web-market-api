import { Injectable } from "@nestjs/common";
import { InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class Promises {
  twoPromiseSettled<T, U>(
    promiseOne: PromiseSettledResult<T>,
    promiseTwo: PromiseSettledResult<U>,
    msg: string,
  ): [T, U] {
    const promiseArray = [promiseOne, promiseTwo];

    const errors = promiseArray.filter(
      (idx: PromiseSettledResult<unknown>): idx is PromiseRejectedResult =>
        idx.status === "rejected",
    );

    if (errors.length) {
      throw new InternalServerErrorException(errors, msg + " Errors");
    }

    const successOne = [promiseOne].find(
      <T>(idx: PromiseSettledResult<T>): idx is PromiseFulfilledResult<T> =>
        idx.status === "fulfilled",
    );

    const successTwo = [promiseTwo].find(
      <U>(idx: PromiseSettledResult<U>): idx is PromiseFulfilledResult<U> =>
        idx.status === "fulfilled",
    );

    return [successOne.value, successTwo.value];
  }

  threePromiseSettled<T, U, V>(
    promiseOne: PromiseSettledResult<T>,
    promiseTwo: PromiseSettledResult<U>,
    promiseThree: PromiseSettledResult<V>,
    msg: string,
  ): [T, U, V] {
    const promiseArray = [promiseOne, promiseTwo, promiseThree];

    const errors = promiseArray.filter(
      (idx: PromiseSettledResult<unknown>): idx is PromiseRejectedResult =>
        idx.status === "rejected",
    );

    if (errors.length) {
      throw new InternalServerErrorException(errors, msg + " Errors");
    }

    const successOne = [promiseOne].find(
      <T>(idx: PromiseSettledResult<T>): idx is PromiseFulfilledResult<T> =>
        idx.status === "fulfilled",
    );

    const successTwo = [promiseTwo].find(
      <U>(idx: PromiseSettledResult<U>): idx is PromiseFulfilledResult<U> =>
        idx.status === "fulfilled",
    );

    const successThree = [promiseThree].find(
      <V>(idx: PromiseSettledResult<V>): idx is PromiseFulfilledResult<V> =>
        idx.status === "fulfilled",
    );

    return [successOne.value, successTwo.value, successThree.value];
  }

  fourPromiseSettled<T, U, V, W>(
    promiseOne: PromiseSettledResult<T>,
    promiseTwo: PromiseSettledResult<U>,
    promiseThree: PromiseSettledResult<V>,
    promiseFour: PromiseSettledResult<W>,
    msg: string,
  ): [T, U, V, W] {
    const promiseArray = [promiseOne, promiseTwo, promiseThree];

    const errors = promiseArray.filter(
      (idx: PromiseSettledResult<unknown>): idx is PromiseRejectedResult =>
        idx.status === "rejected",
    );

    if (errors.length) {
      throw new InternalServerErrorException(errors, msg + " Errors");
    }

    const successOne = [promiseOne].find(
      <T>(idx: PromiseSettledResult<T>): idx is PromiseFulfilledResult<T> =>
        idx.status === "fulfilled",
    );

    const successTwo = [promiseTwo].find(
      <U>(idx: PromiseSettledResult<U>): idx is PromiseFulfilledResult<U> =>
        idx.status === "fulfilled",
    );

    const successThree = [promiseThree].find(
      <V>(idx: PromiseSettledResult<V>): idx is PromiseFulfilledResult<V> =>
        idx.status === "fulfilled",
    );

    const successFour = [promiseFour].find(
      <W>(idx: PromiseSettledResult<W>): idx is PromiseFulfilledResult<W> =>
        idx.status === "fulfilled",
    );

    return [
      successOne.value,
      successTwo.value,
      successThree.value,
      successFour.value,
    ];
  }
}
