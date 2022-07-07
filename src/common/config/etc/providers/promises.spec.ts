import { Test, TestingModule } from "@nestjs/testing";
import { Promises } from "./promises";

describe("Promises", () => {
  let provider: Promises;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Promises],
    }).compile();

    provider = module.get<Promises>(Promises);
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });
});
