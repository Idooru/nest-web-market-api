"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MulterProvider = void 0;
var common_1 = require("@nestjs/common");
var fs = require("fs");
var path = require("path");
var multer = require("multer");
var MulterProvider = /** @class */ (function () {
    function MulterProvider() {
        this.logger = new common_1.Logger("Multer");
    }
    MulterProvider.prototype.createFolder = function (folder1, folder2) {
        try {
            this.logger.log("create uploads folder");
            fs.mkdirSync(path.join(__dirname, "../../../uploads"));
        }
        catch (err) {
            this.logger.log("uploads folder is already exist");
        }
        try {
            this.logger.log("create ".concat(folder1, "folder into uploads foler"));
            fs.mkdirSync(path.join(__dirname, "../../../uploads/".concat(folder1)));
        }
        catch (err) {
            this.logger.log("".concat(folder1, " is already exist"));
        }
        try {
            this.logger.log("create ".concat(folder2, "folder into uploads folder"));
            fs.mkdirSync(path.join(__dirname, "../../../uploads/".concat(folder2)));
        }
        catch (err) {
            this.logger.log("".concat(folder2, " is already exist"));
        }
    };
    MulterProvider.prototype.storage = function (folder1, folder2) {
        this.createFolder(folder1, folder2);
        return multer.diskStorage({
            destination: function (req, file, cb) {
                if (file.mimetype.includes("image")) {
                    var folderName = path.join(__dirname, "../../../uploads/".concat(folder1));
                    cb(null, folderName);
                }
                else {
                    var folderName = path.join(__dirname, "../../../uploads/".concat(folder2));
                    cb(null, folderName);
                }
            },
            filename: function (req, file, cb) {
                var ext = path.extname(file.originalname);
                var fileName = "".concat(path.basename(file.originalname, ext), "-").concat(Date.now()).concat(ext);
                cb(null, fileName);
            }
        });
    };
    MulterProvider.prototype.apply = function (folder1, folder2) {
        var result = {
            storage: this.storage(folder1, folder2)
        };
        return result;
    };
    MulterProvider = __decorate([
        (0, common_1.Injectable)()
    ], MulterProvider);
    return MulterProvider;
}());
exports.MulterProvider = MulterProvider;
