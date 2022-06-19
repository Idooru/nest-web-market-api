"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UserController = void 0;
var common_1 = require("@nestjs/common");
var isLogin_guard_1 = require("./../../../common/guards/isLogin.guard");
var etc_1 = require("../../../common/config/etc");
var get_decoded_jwt_decorator_1 = require("../../../common/decorators/get-decoded-jwt.decorator");
var isNotLogin_guard_1 = require("./../../../common/guards/isNotLogin.guard");
var UserController = /** @class */ (function () {
    function UserController(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    UserController.prototype.register = function (registerUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.register(registerUserDto)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                statusCode: 201,
                                message: "회원가입을 완료하였습니다."
                            }];
                }
            });
        });
    };
    UserController.prototype.login = function (loginUserDto, res) {
        return __awaiter(this, void 0, void 0, function () {
            var jwtToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.login(loginUserDto)];
                    case 1:
                        jwtToken = _a.sent();
                        res.cookie("JWT_COOKIE", jwtToken, etc_1.CookieOption);
                        console.log({ JWT_COOKIE: jwtToken });
                        return [2 /*return*/, {
                                statusCode: 201,
                                message: "로그인을 완료하였습니다. 쿠키를 확인하세요."
                            }];
                }
            });
        });
    };
    UserController.prototype.whoAmI = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            statusCode: 200,
                            message: "본인 정보를 가져옵니다."
                        };
                        return [4 /*yield*/, this.userService.findSelfInfoWithId(user.id)];
                    case 1: return [2 /*return*/, (_a.result = _b.sent(),
                            _a)];
                }
            });
        });
    };
    UserController.prototype.refreshToken = function (jwtPayload, res) {
        return __awaiter(this, void 0, void 0, function () {
            var jwtToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.refreshToken(jwtPayload)];
                    case 1:
                        jwtToken = _a.sent();
                        res.cookie("JWT_COOKIE", jwtToken, etc_1.CookieOption);
                        console.log({ JWT_COOKIE: jwtToken });
                        return [2 /*return*/, {
                                statusCode: 200,
                                message: "토큰을 재발급 받았습니다. 쿠키를 확인하세요.",
                                result: jwtPayload.id
                            }];
                }
            });
        });
    };
    UserController.prototype.logout = function (jwtPayload, res) {
        res.clearCookie("JWT_COOKIE");
        return {
            statusCode: 200,
            message: "로그아웃을 완료하였습니다.",
            result: jwtPayload.id
        };
    };
    UserController.prototype.setUser = function (patchUserDto, jwtPayload, res) {
        return __awaiter(this, void 0, void 0, function () {
            var jwtToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.patchUserAndVerifyToken(patchUserDto, jwtPayload.id)];
                    case 1:
                        jwtToken = _a.sent();
                        res.cookie("JWT_COOKIE", jwtToken, etc_1.CookieOption);
                        console.log({ JWT_COOKIE: jwtToken });
                        return [2 /*return*/, {
                                statusCode: 200,
                                message: "사용자 정보를 수정하고 토큰을 재발급합니다.",
                                result: jwtPayload.id
                            }];
                }
            });
        });
    };
    UserController.prototype.secession = function (jwtPayload, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.deleteUserWithId(jwtPayload.id)];
                    case 1:
                        _a.sent();
                        res.clearCookie("JWT_COOKIE");
                        return [2 /*return*/, {
                                statusCode: 203,
                                message: "사용자 정보를 삭제하였습니다.",
                                result: jwtPayload.id
                            }];
                }
            });
        });
    };
    UserController.prototype.findEmail = function (findEmailDto) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            statusCode: 200,
                            message: "이메일 정보를 가져옵니다."
                        };
                        return [4 /*yield*/, this.authService.findEmail(findEmailDto)];
                    case 1: return [2 /*return*/, (_a.result = _b.sent(),
                            _a)];
                }
            });
        });
    };
    UserController.prototype.resetPassword = function (resetPasswordDto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authService.resetPassword(resetPasswordDto)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                statusCode: 200,
                                message: "사용자 비밀번호를 재설정 하였습니다."
                            }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.UseGuards)(isNotLogin_guard_1.IsNotLoginGuard),
        (0, common_1.Post)("/register"),
        __param(0, (0, common_1.Body)())
    ], UserController.prototype, "register");
    __decorate([
        (0, common_1.UseGuards)(isNotLogin_guard_1.IsNotLoginGuard),
        (0, common_1.Post)("/login"),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Res)())
    ], UserController.prototype, "login");
    __decorate([
        (0, common_1.UseGuards)(isLogin_guard_1.IsLoginGuard),
        (0, common_1.Get)("/whoami"),
        __param(0, (0, get_decoded_jwt_decorator_1.GetDecodedJwt)())
    ], UserController.prototype, "whoAmI");
    __decorate([
        (0, common_1.UseGuards)(isLogin_guard_1.IsLoginGuard),
        (0, common_1.Get)("/refresh-token"),
        __param(0, (0, get_decoded_jwt_decorator_1.GetDecodedJwt)()),
        __param(1, (0, common_1.Res)())
    ], UserController.prototype, "refreshToken");
    __decorate([
        (0, common_1.UseGuards)(isLogin_guard_1.IsLoginGuard),
        (0, common_1.Delete)("/logout"),
        __param(0, (0, get_decoded_jwt_decorator_1.GetDecodedJwt)()),
        __param(1, (0, common_1.Res)())
    ], UserController.prototype, "logout");
    __decorate([
        (0, common_1.UseGuards)(isLogin_guard_1.IsLoginGuard),
        (0, common_1.Patch)("/set-user"),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, get_decoded_jwt_decorator_1.GetDecodedJwt)()),
        __param(2, (0, common_1.Res)())
    ], UserController.prototype, "setUser");
    __decorate([
        (0, common_1.UseGuards)(isLogin_guard_1.IsLoginGuard),
        (0, common_1.Delete)("/secession"),
        __param(0, (0, get_decoded_jwt_decorator_1.GetDecodedJwt)()),
        __param(1, (0, common_1.Res)())
    ], UserController.prototype, "secession");
    __decorate([
        (0, common_1.UseGuards)(isNotLogin_guard_1.IsNotLoginGuard),
        (0, common_1.Get)("/find-email"),
        __param(0, (0, common_1.Query)())
    ], UserController.prototype, "findEmail");
    __decorate([
        (0, common_1.UseGuards)(isNotLogin_guard_1.IsNotLoginGuard),
        (0, common_1.Patch)("/reset-password"),
        __param(0, (0, common_1.Body)())
    ], UserController.prototype, "resetPassword");
    UserController = __decorate([
        (0, common_1.Controller)("/user")
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
