import { applyDecorators } from "@nestjs/common";
import { ApiParam } from "@nestjs/swagger";

export const UuidParamSwagger = ({ name, descriptionName }: { name: string; descriptionName: string }) => {
  return applyDecorators(
    ApiParam({
      name,
      description: `${descriptionName} 입니다. 반드시 uuid 형태 여야 합니다.`,
      required: true,
      example: "02ec774e-ad4b-43dd-936e-8e82cc7c4164",
    }),
  );
};
