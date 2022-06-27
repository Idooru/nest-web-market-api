import { Test, TestingModule } from "@nestjs/testing";
import { Functions } from "./functions";

describe("Functions", () => {
  let provider: Functions;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Functions],
    }).compile();

    provider = module.get<Functions>(Functions);
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });
});
