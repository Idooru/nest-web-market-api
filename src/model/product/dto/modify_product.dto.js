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
exports.ModifyProductDto = exports.ModifyProductBody = void 0;
var product_entity_1 = require("./../product.entity");
var mapped_types_1 = require("@nestjs/mapped-types");
var ModifyProductBody = /** @class */ (function (_super) {
    __extends(ModifyProductBody, _super);
    function ModifyProductBody() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ModifyProductBody;
}((0, mapped_types_1.PickType)(product_entity_1.ProductEntity, [
    "name",
    "price",
    "origin",
    "type",
    "description",
    "quantity",
])));
exports.ModifyProductBody = ModifyProductBody;
var ModifyProductDto = /** @class */ (function (_super) {
    __extends(ModifyProductDto, _super);
    function ModifyProductDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ModifyProductDto;
}((0, mapped_types_1.PickType)(product_entity_1.ProductEntity, [
    "name",
    "price",
    "origin",
    "type",
    "description",
    "imgUrl",
    "quantity",
])));
exports.ModifyProductDto = ModifyProductDto;
