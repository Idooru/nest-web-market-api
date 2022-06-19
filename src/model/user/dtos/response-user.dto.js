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
exports.UserReturnFilter = exports.ResponseUserDto = void 0;
var mapped_types_1 = require("@nestjs/mapped-types");
var user_entity_1 = require("../entities/user.entity");
var ResponseUserDto = /** @class */ (function (_super) {
    __extends(ResponseUserDto, _super);
    function ResponseUserDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ResponseUserDto;
}((0, mapped_types_1.PickType)(user_entity_1.UserEntity, [
    "id",
    "realName",
    "nickName",
    "birth",
    "gender",
    "email",
    "phoneNumber",
    "userType",
])));
exports.ResponseUserDto = ResponseUserDto;
var UserReturnFilter = function (user) { return ({
    id: user.id,
    realName: user.realName,
    nickName: user.nickName,
    birth: user.birth,
    gender: user.gender,
    email: user.email,
    phoneNumber: user.phoneNumber,
    userType: user.userType
}); };
exports.UserReturnFilter = UserReturnFilter;
