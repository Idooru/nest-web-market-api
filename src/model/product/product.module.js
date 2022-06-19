"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProductModule = void 0;
var product_repository_1 = require("./product.repository");
var product_entity_1 = require("./product.entity");
var common_1 = require("@nestjs/common");
var product_controller_1 = require("../product/controllers/product.controller");
var product_service_1 = require("../product/services/product.service");
var typeorm_1 = require("@nestjs/typeorm");
var ProductModule = /** @class */ (function () {
    function ProductModule() {
    }
    ProductModule = __decorate([
        (0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forFeature([product_entity_1.ProductEntity])],
            controllers: [product_controller_1.ProductController],
            providers: [product_service_1.ProductService, product_repository_1.ProductRepository]
        })
    ], ProductModule);
    return ProductModule;
}());
exports.ProductModule = ProductModule;
