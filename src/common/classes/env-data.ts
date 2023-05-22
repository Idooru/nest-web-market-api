import { ConfigService } from "@nestjs/config";
import { EnvKeyNames } from "src/common/security/env-keys";

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

  public getValue(keyName: EnvKeyNames): string {
    return this.envValues
      .find((value) => {
        return value.getKeyName().toLowerCase().includes(keyName);
      })
      .getValue();
  }
}
