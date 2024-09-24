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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const algosdk_1 = __importDefault(require("algosdk"));
const config_1 = require("./config");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const decimals = 6;
    const assetCreateTxn = algosdk_1.default.makeAssetCreateTxnWithSuggestedParamsFromObject({
        sender: config_1.tresuryWallet.addr,
        assetName: "POMA Token",
        unitName: "POMA",
        total: 1000000 * (Math.pow(10, decimals)),
        decimals: decimals,
        defaultFrozen: false,
        manager: config_1.tresuryWallet.addr,
        reserve: config_1.tresuryWallet.addr,
        freeze: config_1.tresuryWallet.addr,
        clawback: config_1.tresuryWallet.addr,
        suggestedParams: yield config_1.algodClient.getTransactionParams().do(),
    });
    const signedAssetCreateTxn = assetCreateTxn.signTxn(config_1.tresuryWallet.sk);
    yield config_1.algodClient.sendRawTransaction(signedAssetCreateTxn).do();
    const result = yield algosdk_1.default.waitForConfirmation(config_1.algodClient, assetCreateTxn.txID(), 3);
    console.log(`Txn Id: ${assetCreateTxn.txID()}\nAsset Id: ${result.assetIndex}`);
}))();
