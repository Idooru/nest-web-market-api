"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ProductController = void 0;
var common_1 = require("@nestjs/common");
var isAdmin_guard_1 = require("./../../../common/guards/isAdmin.guard");
var isLogin_guard_1 = require("./../../../common/guards/isLogin.guard");
var etc_1 = require("./../../../common/config/etc");
var cookies_decorator_1 = require("../../../common/decorators/cookies.decorator");
var ProductController = /** @class */ (function () {
    function ProductController(productService) {
        this.productService = productService;
    }
    ProductController.prototype.getProductsAllFromLatest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            statusCode: 200,
                            message: "전체 상품 정보를 최신 순서로 가져옵니다."
                        };
                        return [4 /*yield*/, this.productService.getProductsAllFromLatest()];
                    case 1: return [2 /*return*/, (_a.result = _b.sent(),
                            _a)];
                }
            });
        });
    };
    ProductController.prototype.getProductsAllFromOldest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            statusCode: 200,
                            message: "전체 상품 정보를 오래된 순서로 가져옵니다."
                        };
                        return [4 /*yield*/, this.productService.getProductsAllFromOldest()];
                    case 1: return [2 /*return*/, (_a.result = _b.sent(),
                            _a)];
                }
            });
        });
    };
    ProductController.prototype.getProductByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            statusCode: 200,
                            message: "".concat(name, "\uC5D0 \uD574\uB2F9\uD558\uB294 \uC0C1\uD488 \uC815\uBCF4\uB97C \uAC00\uC838\uC635\uB2C8\uB2E4.")
                        };
                        return [4 /*yield*/, this.productService.getProductByName(name)];
                    case 1: return [2 /*return*/, (_a.result = _b.sent(),
                            _a)];
                }
            });
        });
    };
    ProductController.prototype.getProductById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            statusCode: 200,
                            message: "".concat(id, "\uC5D0 \uD574\uB2F9\uD558\uB294 \uC0C1\uD488 \uC815\uBCF4\uB97C \uAC00\uC838\uC635\uB2C8\uB2E4.")
                        };
                        return [4 /*yield*/, this.productService.getProductById(id)];
                    case 1: return [2 /*return*/, (_a.result = _b.sent(),
                            _a)];
                }
            });
        });
    };
    ProductController.prototype.createProduct = function (createProductBody, productImg, res) {
        return __awaiter(this, void 0, void 0, function () {
            var createProductDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!productImg)
                            productImg = "no image yet";
                        createProductDto = __assign(__assign({}, createProductBody), { imgUrl: productImg });
                        return [4 /*yield*/, this.productService.createProduct(createProductDto)];
                    case 1:
                        _a.sent();
                        try {
                            res.clearCookie(etc_1.ProductImageCookieKey);
                        }
                        catch (err) {
                            throw new common_1.NotFoundException("쿠키가 변조 되었습니다.");
                        }
                        return [2 /*return*/, {
                                statusCode: 201,
                                message: "상품을 생성하였습니다."
                            }];
                }
            });
        });
    };
    ProductController.prototype.modifyProduct = function (id, modifyProductBody, productImg, res) {
        return __awaiter(this, void 0, void 0, function () {
            var modifyProductDto_1, modifyProductDto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!productImg) return [3 /*break*/, 2];
                        modifyProductDto_1 = __assign(__assign({}, modifyProductBody), { imgUrl: productImg });
                        return [4 /*yield*/, this.productService.modifyProduct(id, modifyProductDto_1)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        modifyProductDto = __assign({}, modifyProductBody);
                        return [4 /*yield*/, this.productService.modifyProduct(id, modifyProductDto)];
                    case 3:
                        _a.sent();
                        try {
                            res.clearCookie(etc_1.ProductImageCookieKey);
                        }
                        catch (err) {
                            throw new common_1.NotFoundException("쿠키가 변조 되었습니다.");
                        }
                        return [2 /*return*/, {
                                statusCode: 201,
                                message: "상품을 수정하였습니다.",
                                result: id
                            }];
                }
            });
        });
    };
    ProductController.prototype.removeProduct = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.productService.removeProduct(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                statusCode: 201,
                                message: "".concat(id, "\uC5D0 \uD574\uB2F9\uD558\uB294 \uC0C1\uD488\uC744 \uC81C\uAC70\uD558\uC600\uC2B5\uB2C8\uB2E4.")
                            }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)("/")
    ], ProductController.prototype, "getProductsAllFromLatest");
    __decorate([
        (0, common_1.Get)("/oldest")
    ], ProductController.prototype, "getProductsAllFromOldest");
    __decorate([
        (0, common_1.Get)("/search_n"),
        __param(0, (0, common_1.Query)("name"))
    ], ProductController.prototype, "getProductByName");
    __decorate([
        (0, common_1.Get)("/search_i"),
        __param(0, (0, common_1.Query)("id"))
    ], ProductController.prototype, "getProductById");
    __decorate([
        (0, common_1.UseGuards)(isAdmin_guard_1.IsAdminGuard),
        (0, common_1.UseGuards)(isLogin_guard_1.IsLoginGuard),
        (0, common_1.Post)("/"),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, cookies_decorator_1.Cookies)(etc_1.ProductImageCookieKey)),
        __param(2, (0, common_1.Res)())
    ], ProductController.prototype, "createProduct");
    __decorate([
        (0, common_1.UseGuards)(isAdmin_guard_1.IsAdminGuard),
        (0, common_1.UseGuards)(isLogin_guard_1.IsLoginGuard),
        (0, common_1.Patch)("/qi"),
        __param(0, (0, common_1.Query)("id")),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, cookies_decorator_1.Cookies)(etc_1.ProductImageCookieKey)),
        __param(3, (0, common_1.Res)())
    ], ProductController.prototype, "modifyProduct");
    __decorate([
        (0, common_1.UseGuards)(isAdmin_guard_1.IsAdminGuard),
        (0, common_1.UseGuards)(isLogin_guard_1.IsLoginGuard),
        (0, common_1.Delete)("/qi"),
        __param(0, (0, common_1.Query)("id"))
    ], ProductController.prototype, "removeProduct");
    ProductController = __decorate([
        (0, common_1.Controller)("/product")
    ], ProductController);
    return ProductController;
}());
exports.ProductController = ProductController;
