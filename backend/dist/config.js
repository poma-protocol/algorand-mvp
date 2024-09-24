"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PINATA_SECRET_KEY = exports.PINATA_KEY = exports.indexerClient = exports.algodClient = exports.tresuryWallet = exports.tokenId = void 0;
exports.getNftIndex = getNftIndex;
exports.incrementNftIndex = incrementNftIndex;
const algosdk_1 = __importDefault(require("algosdk"));
const dotenv_1 = require("dotenv");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
(0, dotenv_1.config)();
const tresuryWalletMnemonic = process.env.TRESURY_WALLET_MNEMONIC || "";
if (tresuryWalletMnemonic === "") {
    throw new Error("TRESURY_WALLET_MNEMONIC is required");
}
exports.tokenId = parseInt(process.env.TOKEN_ID || "0");
if (exports.tokenId === 0) {
    throw new Error("TOKEN_ID is required");
}
exports.tresuryWallet = algosdk_1.default.mnemonicToSecretKey(tresuryWalletMnemonic);
exports.algodClient = new algosdk_1.default.Algodv2("a".repeat(64), "https://testnet-api.4160.nodely.dev", 443);
exports.indexerClient = new algosdk_1.default.Indexer("a".repeat(64), "https://testnet-idx.4160.nodely.dev", 443);
exports.PINATA_KEY = process.env.PINATA_KEY || "";
exports.PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || "";
// Define the file path for "nftIndex"
const filePath = path.join(__dirname, 'nftIndex');
// Function to read and format the number in the file
function getNftIndex() {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        // If it doesn't exist, create the file with the number 1 and return "001"
        fs.writeFileSync(filePath, '1');
        return '001';
    }
    // Read the content of the file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const number = parseInt(fileContent, 10);
    // Ensure the number is 3 digits (e.g., 6 -> "006")
    const formattedNumber = number.toString().padStart(3, '0');
    return formattedNumber;
}
// Function to increment the number in the file
function incrementNftIndex() {
    // Get the current number from the file
    const currentIndex = getNftIndex();
    // Convert the number back to a regular integer
    const currentNumber = parseInt(currentIndex, 10);
    // Increment the number and update the file
    const newNumber = currentNumber + 1;
    fs.writeFileSync(filePath, newNumber.toString());
}
