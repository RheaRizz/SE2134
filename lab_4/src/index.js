"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = require("bcrypt");
var body_parser_1 = require("body-parser");
var express_1 = require("express");
var jwt = require("jsonwebtoken");
var pg_1 = require("pg");
var pool = new pg_1.Pool({
    connectionString: 'postgres://postgres:1234@localhost:5433/SE2134',
});
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var app, connection;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = (0, express_1.default)();
                    return [4 /*yield*/, pool.connect()];
                case 1:
                    connection = _a.sent();
                    app
                        .use(body_parser_1.default.json())
                        .use(body_parser_1.default.urlencoded({ extended: true }))
                        .post('/register', function (request, response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, email, password, hashedPassword, rows;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = request.body, email = _a.email, password = _a.password;
                                    return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                                case 1:
                                    hashedPassword = _b.sent();
                                    return [4 /*yield*/, connection.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email', [email, hashedPassword])];
                                case 2:
                                    rows = (_b.sent()).rows;
                                    response.json({ createdUser: rows[0] });
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .post('/login', function (request, response) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, email, password, rows, correctPassword, token;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = request.body, email = _a.email, password = _a.password;
                                    return [4 /*yield*/, connection.query('SELECT * FROM users WHERE email = $1', [email])];
                                case 1:
                                    rows = (_b.sent()).rows;
                                    if (!(rows.length === 0)) return [3 /*break*/, 2];
                                    response
                                        .status(401)
                                        .json({ message: 'Email or password is incorrect' });
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, bcrypt_1.default.compare(password, rows[0].password)];
                                case 3:
                                    correctPassword = _b.sent();
                                    if (correctPassword) {
                                        token = jwt.sign({ userId: rows[0].id, email: rows[0].email }, 'secret', // don't expose this secret
                                        {
                                            expiresIn: '1h',
                                        });
                                        response.json({ token: token });
                                    }
                                    else {
                                        response
                                            .status(401)
                                            .json({ message: 'Email or password is incorrect' });
                                    }
                                    _b.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })
                        .get('/me', function (request, response) { return __awaiter(_this, void 0, void 0, function () {
                        var authHeader, token, claims, userId, rows, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    authHeader = request.header('Authorization');
                                    token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
                                    if (!token) {
                                        response.status(401).json({ message: 'Not authenticated' });
                                        return [2 /*return*/];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    claims = jwt.verify(token, 'secret');
                                    userId = claims.userId;
                                    return [4 /*yield*/, connection.query('SELECT id, email, presidentialBet FROM users WHERE id = $1', [userId])];
                                case 2:
                                    rows = (_a.sent()).rows;
                                    response.json({ me: rows[0] });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _a.sent();
                                    response.status(401).json({ message: 'Not authenticated' });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })
                        .get('/channels', function (request, response) { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, connection.query('SELECT * FROM channels ORDER BY name')];
                                case 1:
                                    result = _a.sent();
                                    response.json(result.rows);
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .get('/messages/:channelName', function (request, response) { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, connection.query(
                                    /* sql */ "\n        select messages.* from messages \n        inner join channels on messages.channel_id = channels.id \n        where name = $1\n      ", [request.params.channelName])];
                                case 1:
                                    result = _a.sent();
                                    console.log('DB results', result.rows);
                                    response.json(result.rows);
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .use(express_1.default.static('public'))
                        .listen(3000, function () {
                        console.log('Server has started at http://localhost:3000');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
startServer();
