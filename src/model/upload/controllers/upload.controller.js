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
exports.UploadController = void 0;
var common_1 = require("@nestjs/common");
var isAdmin_guard_1 = require("../../../common/guards/isAdmin.guard");
var isLogin_guard_1 = require("../../../common/guards/isLogin.guard");
var multer_provider_1 = require("../multer.provider");
var platform_express_1 = require("@nestjs/platform-express");
var get_decoded_jwt_decorator_1 = require("../../../common/decorators/get-decoded-jwt.decorator");
var etc_1 = require("../../../common/config/etc");
var etc_2 = require("./../../../common/config/etc");
var UploadController = /** @class */ (function () {
    function UploadController(uploadService) {
        this.uploadService = uploadService;
    }
    UploadController.prototype.uploadImgForProduct = function (file, jwtPayload, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("logging image info ->\n", file);
                        return [4 /*yield*/, this.uploadService.uploadImgForProduct(file, jwtPayload)];
                    case 1:
                        result = _a.sent();
                        res.cookie(etc_2.ProductImageCookieKey, result.url, etc_1.CookieOption);
                        return [2 /*return*/, {
                                statusCode: 201,
                                message: "사진을 업로드 하였습니다.",
                                result: result
                            }];
                }
            });
        });
    };
    UploadController.prototype.findAll = function () {
        return this.uploadService.findAll();
    };
    UploadController.prototype.findOne = function (id) {
        return this.uploadService.findOne(+id);
    };
    UploadController.prototype.update = function (id, updateUploadDto) {
        return this.uploadService.update(+id, updateUploadDto);
    };
    UploadController.prototype.remove = function (id) {
        return this.uploadService.remove(+id);
    };
    __decorate([
        (0, common_1.UseGuards)(isAdmin_guard_1.IsAdminGuard),
        (0, common_1.UseGuards)(isLogin_guard_1.IsLoginGuard),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("image", new multer_provider_1.MulterProvider().apply("image", "video"))),
        (0, common_1.Post)("/image-for-product"),
        __param(0, (0, common_1.UploadedFile)()),
        __param(1, (0, get_decoded_jwt_decorator_1.GetDecodedJwt)()),
        __param(2, (0, common_1.Res)())
    ], UploadController.prototype, "uploadImgForProduct");
    __decorate([
        (0, common_1.UseGuards)(isLogin_guard_1.IsLoginGuard)
        // @UseInterceptors(FilesInterceptor("video", new MulterProvider().apply()))
        ,
        (0, common_1.Get)()
    ], UploadController.prototype, "findAll");
    __decorate([
        (0, common_1.Get)(":id"),
        __param(0, (0, common_1.Param)("id"))
    ], UploadController.prototype, "findOne");
    __decorate([
        (0, common_1.Patch)(":id"),
        __param(0, (0, common_1.Param)("id")),
        __param(1, (0, common_1.Body)())
    ], UploadController.prototype, "update");
    __decorate([
        (0, common_1.Delete)(":id"),
        __param(0, (0, common_1.Param)("id"))
    ], UploadController.prototype, "remove");
    UploadController = __decorate([
        (0, common_1.Controller)("upload")
    ], UploadController);
    return UploadController;
}());
exports.UploadController = UploadController;
