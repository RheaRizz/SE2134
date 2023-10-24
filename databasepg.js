"use strict";
// import { Client } from 'pg';
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
// const client = new Client({
//     host: "localhost",
//     user: "postgres",
//     port: 5433,
//     password: "1234",
//     database: "SE2134"
// });
// client.connect();
// client.query(`Select * from loan`, (err, res) => {
//     if (!err) {
//         console.log(res.rows);
//     } else {
//         console.log(err.message);
//     }
//     client.end(); // Note: You should call the `end` method as a function, like this.
// });
var http = require("http");
var pg_1 = require("pg");
var fs = require("fs");
var url_1 = require("url");
// Create a PostgreSQL database connection pool
var pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'SE2134',
    password: '1234',
    port: 5433,
});
function handleRequest(request, response) {
    return __awaiter(this, void 0, void 0, function () {
        var url, method, body_1;
        var _this = this;
        return __generator(this, function (_a) {
            url = request.url;
            method = request.method;
            if (url === '/apply-loan') {
                fs.readFile('lab2-2.html', function (err, data) {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'text/plain' });
                        response.end('Internal Server Error');
                    }
                    else {
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.end(data);
                    }
                });
            }
            else if (url === '/apply-loan-success' && method === 'POST') {
                body_1 = '';
                request.on('data', function (chunk) {
                    body_1 += chunk.toString();
                });
                request.on('end', function () { return __awaiter(_this, void 0, void 0, function () {
                    var formData, name_1, email, phone, loan_amount, reason, status_1, insertQuery, values, client, result, error_1, error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 9, , 10]);
                                formData = new url_1.URLSearchParams(body_1);
                                name_1 = formData.get('name');
                                email = formData.get('email');
                                phone = formData.get('phone');
                                loan_amount = formData.get('loan_amount');
                                reason = formData.get('reason');
                                status_1 = formData.get('status');
                                insertQuery = "\n          INSERT INTO loan (name, email, phone, loan_amount, purpose, status)\n          VALUES ($1, $2, $3, $4, $5, 'APPLIED')\n          RETURNING id";
                                values = [name_1, email, phone, loan_amount, reason, status_1];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 7, , 8]);
                                return [4 /*yield*/, pool.connect()];
                            case 2:
                                client = _a.sent();
                                _a.label = 3;
                            case 3:
                                _a.trys.push([3, , 5, 6]);
                                return [4 /*yield*/, client.query(insertQuery, values)];
                            case 4:
                                result = _a.sent();
                                response.writeHead(200, { 'Content-Type': 'text/html' });
                                response.end("Loan application submitted successfully. Your Loan ID is: ".concat(result.rows[0].id));
                                return [3 /*break*/, 6];
                            case 5:
                                client.release();
                                return [7 /*endfinally*/];
                            case 6: return [3 /*break*/, 8];
                            case 7:
                                error_1 = _a.sent();
                                console.error('Error executing SQL query:', error_1);
                                response.writeHead(500, { 'Content-Type': 'text/plain' });
                                response.end('Internal Server Error');
                                return [3 /*break*/, 8];
                            case 8: return [3 /*break*/, 10];
                            case 9:
                                error_2 = _a.sent();
                                console.error('Error parsing form data:', error_2);
                                response.writeHead(400, { 'Content-Type': 'text/plain' });
                                response.end('Bad Request');
                                return [3 /*break*/, 10];
                            case 10: return [2 /*return*/];
                        }
                    });
                }); });
            }
            return [2 /*return*/];
        });
    });
}
var server = http.createServer(handleRequest);
server.listen(3000, function () {
    console.log('Server started at http://localhost:3000');
});
