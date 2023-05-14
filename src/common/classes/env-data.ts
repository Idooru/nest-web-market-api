import { ConfigService } from "@nestjs/config";

export class EnvData {
  private envValues: { [x: string]: any }[];

  constructor(private readonly envKeys: string[]) {
    this.envValues = this.envKeys.map((key: string) => {
      const value = new ConfigService().getOrThrow(key);
      return {
        [key]: value,
        getKeyName(): string {
          return key;
        },
        getValue(): string {
          return value;
        },
      };
    });
  }

  public getValue(keyName: string): string {
    const result = this.envValues
      .find((value) => {
        return value.getKeyName().toLowerCase().includes(keyName);
      })
      .getValue();

    if (!result) {
      throw new Error(`옳바르지 않은 키 이름(${keyName})입니다.`);
    }

    return result;
  }
}
