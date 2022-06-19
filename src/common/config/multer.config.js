"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MulterOperation = void 0;
var common_1 = require("@nestjs/common");
var fs = require("fs");
var path = require("path");
var multer = require("multer");
var MulterOperation = /** @class */ (function () {
    function MulterOperation(folder) {
        this.folder = folder;
        this.logger = new common_1.Logger("Multer");
    }
    MulterOperation.prototype.createFolder = function (folder) {
        try {
            this.logger.log("create uploads folder");
            fs.mkdirSync(path.join(__dirname, "../../../uploads"));
        }
        catch (err) {
            this.logger.log("uploads folder is already exist");
        }
        try {
            this.logger.log("create ".concat(folder, " folder into uploads foler"));
            fs.mkdirSync(path.join(__dirname, "../../../uploads/".concat(folder)));
        }
        catch (err) {
            this.logger.log("".concat(folder, " is already exist"));
        }
    };
    MulterOperation.prototype.storage = function (folder) {
        this.createFolder(folder);
        return multer.diskStorage({
            destination: function (req, file, cb) {
                var folderName = path.join(__dirname, "../../../uploads/".concat(folder));
                cb(null, folderName);
            },
            filename: function (req, file, cb) {
                var ext = path.extname(file.originalname);
                var fileName = "".concat(path.basename(file.originalname, ext), "-").concat(Date.now()).concat(ext);
                cb(null, fileName);
            }
        });
    };
    MulterOperation.prototype.apply = function () {
        var result = {
            storage: this.storage(this.folder)
        };
        return result;
    };
    MulterOperation = __decorate([
        (0, common_1.Injectable)()
    ], MulterOperation);
    return MulterOperation;
}());
exports.MulterOperation = MulterOperation;
