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
exports.VideosEntity = exports.ImagesEntity = void 0;
var class_validator_1 = require("class-validator");
var common_entity_1 = require("../../../common/entities/common.entity");
var typeorm_1 = require("typeorm");
var ImagesEntity = /** @class */ (function (_super) {
    __extends(ImagesEntity, _super);
    function ImagesEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, typeorm_1.Column)({ type: "varchar", nullable: false, unique: true })
    ], ImagesEntity.prototype, "imageFileName");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, typeorm_1.Column)({ type: "varchar", nullable: false })
    ], ImagesEntity.prototype, "uploader");
    ImagesEntity = __decorate([
        (0, typeorm_1.Entity)("images")
    ], ImagesEntity);
    return ImagesEntity;
}(common_entity_1.CommonEntity));
exports.ImagesEntity = ImagesEntity;
var VideosEntity = /** @class */ (function (_super) {
    __extends(VideosEntity, _super);
    function VideosEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, typeorm_1.Column)({ type: "varchar", nullable: false, unique: true })
    ], VideosEntity.prototype, "videoFileName");
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        (0, typeorm_1.Column)({ type: "varchar", nullable: false })
    ], VideosEntity.prototype, "uploader");
    VideosEntity = __decorate([
        (0, typeorm_1.Entity)("videos")
    ], VideosEntity);
    return VideosEntity;
}(common_entity_1.CommonEntity));
exports.VideosEntity = VideosEntity;
