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
exports.__esModule = true;
exports.ImageUploadDto = void 0;
var mapped_types_1 = require("@nestjs/mapped-types");
var upload_entity_1 = require("../entities/upload.entity");
var ImageUploadDto = /** @class */ (function (_super) {
    __extends(ImageUploadDto, _super);
    function ImageUploadDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ImageUploadDto;
}((0, mapped_types_1.PickType)(upload_entity_1.VideosEntity, [
    "videoFileName",
    "uploader",
])));
exports.ImageUploadDto = ImageUploadDto;
