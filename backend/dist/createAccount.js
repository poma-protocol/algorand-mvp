"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const algosdk_1 = __importDefault(require("algosdk"));
const account = algosdk_1.default.generateAccount();
console.log(`account address: ${account.addr.toString()}
    account sk: ${algosdk_1.default.secretKeyToMnemonic(account.sk)}
`);
