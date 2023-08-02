// async findEmail(findEmailDto: FindEmailDto): Promise<string> {
//     const { realname, phonenumber } = findEmailDto;

//     const [realNameFound, phoneNumberFound] = await Promise.all([
//       this.userGeneralRepository.findUserWithRealName(realname),
//       this.userGeneralRepository.findUserWithPhoneNumber(phonenumber),
//     ]);

//     this.methodName = this.findEmail.name;
//     const message = "사용자 실명과 전화번호가 서로 일치하지 않습니다.";

//     if (realNameFound === null || phoneNumberFound === null) {
//       this.httpExceptionHandlingBuilder
//         .setMessage(message)
//         .setOccuredLocation("class")
//         .setOccuredClass(this.className, this.methodName)
//         .setExceptionStatus(HttpStatus.UNAUTHORIZED)
//         .handle();
//     } else if (realNameFound.id !== phoneNumberFound.id) {
//       this.httpExceptionHandlingBuilder
//         .setMessage(message)
//         .setOccuredLocation("class")
//         .setOccuredClass(this.className, this.methodName)
//         .setExceptionStatus(HttpStatus.UNAUTHORIZED)
//         .handle();
//     }

//     return realNameFound.Auth.email;
//   }
