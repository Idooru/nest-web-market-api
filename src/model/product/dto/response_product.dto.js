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
exports.ProductsReturnFilter = exports.ProductReturnFilter = exports.ResponseProductsDto = exports.ResponseProductDto = void 0;
var mapped_types_1 = require("@nestjs/mapped-types");
var product_entity_1 = require("../product.entity");
var ResponseProductDto = /** @class */ (function (_super) {
    __extends(ResponseProductDto, _super);
    function ResponseProductDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ResponseProductDto;
}((0, mapped_types_1.PickType)(product_entity_1.ProductEntity, [
    "id",
    "name",
    "price",
    "origin",
    "type",
    "description",
    "imgUrl",
    "rating",
    "createdAt",
    "updatedAt",
])));
exports.ResponseProductDto = ResponseProductDto;
var ResponseProductsDto = /** @class */ (function (_super) {
    __extends(ResponseProductsDto, _super);
    function ResponseProductsDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ResponseProductsDto;
}((0, mapped_types_1.PickType)(product_entity_1.ProductEntity, [
    "name",
    "price",
    "type",
    "imgUrl",
    "rating",
])));
exports.ResponseProductsDto = ResponseProductsDto;
var ProductReturnFilter = function (product) { return ({
    id: product.id,
    name: product.name,
    price: product.price,
    origin: product.origin,
    type: product.type,
    description: product.description,
    imgUrl: product.imgUrl,
    rating: product.rating,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
}); };
exports.ProductReturnFilter = ProductReturnFilter;
var ProductsReturnFilter = function (products) {
    return products.map(function (idx) { return ({
        name: idx.name,
        price: idx.price,
        type: idx.type,
        imgUrl: idx.imgUrl,
        rating: idx.rating
    }); });
};
exports.ProductsReturnFilter = ProductsReturnFilter;
