export const typeOrmErrorSwagger = {
  summary: "typeorm 에러",
  description: "typeorm 내부에서 발생한 handling된 exception으로 주로 transaction 로직 내에서 handling 될 수 있습니다.",
  value: {
    success: false,
    error: "Error",
    statusCode: 500,
    timeStamp: "Sun Mar 16 2025 19:04:13 GMT+0900 (Korean Standard Time)",
    message: "typeorm error",
    info: "Typeorm Config, Entity, 요청 쿼리, SQL 서버의 상태를 확인하세요.",
  },
};
