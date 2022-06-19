"use strict";
exports.__esModule = true;
exports.ProductImageCookieKey = exports.JwtOptions = exports.CookieOption = void 0;
exports.CookieOption = {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + 100000000000)
};
exports.JwtOptions = {
    secret: process.env.JWT_SECRET
};
exports.ProductImageCookieKey = "imageUrl";
