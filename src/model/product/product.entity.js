"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProductEntity = void 0;
var class_validator_1 = require("class-validator");
var common_entity_1 = require("../../common/entities/common.entity");
var typeorm_1 = require("typeorm");
var ProductEntity = /** @class */ (function (_super) {
    __extends(ProductEntity, _super);
    function ProductEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, typeorm_1.Column)({ type: "varchar", length: 20, unique: true, nullable: false })
    ], ProductEntity.prototype, "name");
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, typeorm_1.Column)({ type: "int", unsigned: true, nullable: false })
    ], ProductEntity.prototype, "price");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, typeorm_1.Column)({ type: "varchar", length: 20, nullable: false })
    ], ProductEntity.prototype, "origin");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, typeorm_1.Column)({ type: "varchar", length: 20, nullable: false })
    ], ProductEntity.prototype, "type");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, typeorm_1.Column)({ type: "text", nullable: true })
    ], ProductEntity.prototype, "description");
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", "default": "no image yet" })
    ], ProductEntity.prototype, "imgUrl");
    __decorate([
        (0, typeorm_1.Column)({ type: "int", "default": 50 })
    ], ProductEntity.prototype, "quantity");
    __decorate([
        (0, typeorm_1.Column)({ type: "float", "default": 0.0 })
    ], ProductEntity.prototype, "rating");
    ProductEntity = __decorate([
        (0, typeorm_1.Entity)("products")
    ], ProductEntity);
    return ProductEntity;
}(common_entity_1.CommonEntity));
exports.ProductEntity = ProductEntity;
