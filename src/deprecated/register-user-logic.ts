// controller

// @UseInterceptors(JsonGeneralInterceptor)
//   @UseGuards(
//     new VerifyDataGuard(
//       userVerifyCookieKey.is_not_exist.email_executed,
//       userVerifyCookieKey.is_not_exist.nickname_executed,
//       userVerifyCookieKey.is_not_exist.phonenumber_executed,
//     ),
//   )
//   @UseGuards(IsNotLoginGuard)
//   @Post("/register")
//   async register(
//     @Body() registerUserDto: RegisterUserDto,
//   ): Promise<JsonGeneralInterface<void>> {

//     const userBase = await this.userGeneralService.createUserBase(
//         registerUserDto,
//       );

//       await this.userGeneralService.createClientOrAdmin(
//         registerUserDto,
//         userBase,
//       );

//       const user = await this.userAccessorySrevice.findUserWithEmail(
//         registerUserDto.email,
//       );

//       await this.emailSenderLibrary.sendMailToClientAboutRegister(user);

//     return {
//       statusCode: 201,
//       message: "사용자 회원가입을 완료하였습니다.",
//     };
//   }

// service

// async createUserBase(registerUserDto: RegisterUserDto): Promise<UserEntity> {
//     const {
//       realName,
//       nickName,
//       birth,
//       gender,
//       email,
//       phoneNumber,
//       type,
//       password,
//     } = registerUserDto;
//     let hashed: string;
//     try {
//       hashed = await bcrypt.hash(password, this.securityLibrary.getHashSalt());
//     } catch (err) {
//       this.methodName = this.createUserBase.name;
//       this.libraryErrorHandlerBuilder
//         .setError(err)
//         .setLibraryName("bcrypt")
//         .setSourceNames(this.className, this.methodName)
//         .handle();
//     }
//     const userProfileColumn = { realName, birth, gender, phoneNumber };
//     const userAuthColumn = { nickName, email, password: hashed };
//     const [userProfileDummy, userAuthDummy] = await Promise.all([
//       this.userGeneralRepository.createUserProfile(userProfileColumn),
//       this.userGeneralRepository.createUserAuth(userAuthColumn),
//     ]);
//     const [userProfile, userAuth] = await Promise.all([
//       this.userGeneralRepository.findUserProfile(userProfileDummy),
//       this.userGeneralRepository.findUserAuth(userAuthDummy),
//     ]);
//     const createUserBaseDto: CreateUserBaseDto = {
//       Profile: userProfile,
//       Auth: userAuth,
//       type,
//     };
//     const userBaseOutput = await this.userGeneralRepository.createUserBase(
//       createUserBaseDto,
//     );
//     const userBaseId: string = userBaseOutput.generatedMaps[0].id;
//     const userBase = await this.userInsertRepository.findOneUserBaseById(
//       userBaseId,
//     );
//     await Promise.all([
//       this.userInsertRepository.insertUserBaseIdOnUserProfile(
//         userBase,
//         userProfile,
//       ),
//       this.userInsertRepository.insertUserBaseIdOnUserAuth(userBase, userAuth),
//     ]);
//     return userBase;
//   }

//   async createClientOrAdmin(
//     registerUserDto: RegisterUserDto,
//     userBase: UserEntity,
//   ): Promise<void> {
//     if (registerUserDto.type.toString() === "client") {
//       const clientUserOutput =
//         await this.userGeneralRepository.createClientUser(userBase);
//       const clientUserId: string = clientUserOutput.generatedMaps[0].id;
//       const clientUser = await this.userInsertRepository.findOneClientUserById(
//         clientUserId,
//       );
//       await this.userInsertRepository.insertUserBaseIdOnClientUser(
//         userBase,
//         clientUser,
//       );
//     } else {
//       const adminUserOutput = await this.userGeneralRepository.createAdminUser(
//         userBase,
//       );
//       const adminUserId: string = adminUserOutput.generatedMaps[0].id;
//       const adminUser = await this.userInsertRepository.findOneAdminUserById(
//         adminUserId,
//       );
//       await this.userInsertRepository.insertUserBaseIdOnAdminUser(
//         userBase,
//         adminUser,
//       );
//     }
//   }
