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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const algosdk_1 = __importDefault(require("algosdk"));
const config_1 = require("./config");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/token-transfer", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (!data.receiver && !data.quantity) {
        return res
            .status(500)
            .json({ message: "receiver and quantity are required" });
    }
    if (!algosdk_1.default.isValidAddress(data.receiver)) {
        return res.status(500).json({ message: "Invalid receiver address" });
    }
    if (data.quantity <= 0) {
        return res.status(500).json({ message: "Invalid quantity" });
    }
    const assetDetails = yield config_1.indexerClient.lookupAssetByID(config_1.tokenId).do();
    const decimals = assetDetails.asset.params.decimals;
    const receiver = data.receiver;
    const quantity = Number(data.quantity);
    try {
        const txn = algosdk_1.default.makeAssetTransferTxnWithSuggestedParamsFromObject({
            sender: config_1.tresuryWallet.addr,
            receiver: receiver,
            amount: quantity * Math.pow(10, decimals),
            assetIndex: config_1.tokenId,
            suggestedParams: yield config_1.algodClient.getTransactionParams().do(),
        });
        const signedTxn = txn.signTxn(config_1.tresuryWallet.sk);
        yield config_1.algodClient.sendRawTransaction(signedTxn).do();
        const result = yield algosdk_1.default.waitForConfirmation(config_1.algodClient, txn.txID(), 3);
        return res.status(200).json({
            message: `${quantity} POMA Tokens Transferred Successfully to ${receiver}`,
            txId: txn.txID(),
            round: Number(result.confirmedRound),
        });
    }
    catch (error) {
        return res.status(500).json({ message: `Error Occured: ${error.message}` });
    }
}));
app.post("/token-transfer-2", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (!data.receiver && !data.referralCount) {
        return res
            .status(500)
            .json({ message: "receiver and referral Count are required" });
    }
    if (!algosdk_1.default.isValidAddress(data.receiver)) {
        return res.status(500).json({ message: "Invalid receiver address" });
    }
    if (Number(data.quantity) <= 0) {
        return res.status(500).json({ message: "Invalid referral Count" });
    }
    const assetDetails = yield config_1.indexerClient.lookupAssetByID(config_1.tokenId).do();
    const decimals = assetDetails.asset.params.decimals;
    const receiver = data.receiver;
    const referralCount = Number(data.quantity);
    const rewardForEachReferral = 15;
    try {
        const txn = algosdk_1.default.makeAssetTransferTxnWithSuggestedParamsFromObject({
            sender: config_1.tresuryWallet.addr,
            receiver: receiver,
            amount: referralCount * rewardForEachReferral * Math.pow(10, decimals),
            assetIndex: config_1.tokenId,
            suggestedParams: yield config_1.algodClient.getTransactionParams().do(),
        });
        const signedTxn = txn.signTxn(config_1.tresuryWallet.sk);
        yield config_1.algodClient.sendRawTransaction(signedTxn).do();
        const result = yield algosdk_1.default.waitForConfirmation(config_1.algodClient, txn.txID(), 3);
        return res.status(200).json({
            message: `Referals (${referralCount}) x Reward for Each Referral (${rewardForEachReferral}) = ${referralCount * rewardForEachReferral} POMA Tokens Transferred Successfully to ${receiver}`,
            txId: txn.txID(),
            round: Number(result.confirmedRound),
        });
    }
    catch (error) {
        return res.status(500).json({ message: `Error Occured: ${error.message}` });
    }
}));
app.post("/token-transfer-3", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (!data.receiver && !data.referralCount) {
        return res
            .status(500)
            .json({ message: "receiver and Number of On-Chain Transactions are required" });
    }
    if (!algosdk_1.default.isValidAddress(data.receiver)) {
        return res.status(500).json({ message: "Invalid receiver address" });
    }
    if (Number(data.quantity) <= 0) {
        return res.status(500).json({ message: "Invalid Number of On-Chain Transactions" });
    }
    const assetDetails = yield config_1.indexerClient.lookupAssetByID(config_1.tokenId).do();
    const decimals = assetDetails.asset.params.decimals;
    const receiver = data.receiver;
    const referralCount = Number(data.quantity);
    const rewardForEachReferral = 0.1;
    try {
        const txn = algosdk_1.default.makeAssetTransferTxnWithSuggestedParamsFromObject({
            sender: config_1.tresuryWallet.addr,
            receiver: receiver,
            amount: referralCount * rewardForEachReferral * Math.pow(10, decimals),
            assetIndex: config_1.tokenId,
            suggestedParams: yield config_1.algodClient.getTransactionParams().do(),
        });
        const signedTxn = txn.signTxn(config_1.tresuryWallet.sk);
        yield config_1.algodClient.sendRawTransaction(signedTxn).do();
        const result = yield algosdk_1.default.waitForConfirmation(config_1.algodClient, txn.txID(), 3);
        return res.status(200).json({
            message: `Referals (${referralCount}) x Reward for Each On-Chain Transaction (${rewardForEachReferral}) = ${referralCount * rewardForEachReferral} POMA Tokens Transferred Successfully to ${receiver}`,
            txId: txn.txID(),
            round: Number(result.confirmedRound),
        });
    }
    catch (error) {
        return res.status(500).json({ message: `Error Occured: ${error.message}` });
    }
}));
function pinJson(jsonData) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
        const payload = {
            pinataContent: jsonData,
        };
        const headers = {
            "Content-Type": "application/json",
            pinata_api_key: config_1.PINATA_KEY,
            pinata_secret_api_key: config_1.PINATA_SECRET_KEY,
        };
        const response = yield fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = yield response.json();
        return data;
    });
}
app.post("/mint-nft", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageMimeType = "image/png";
        const imageSHA256 = "2b791ca8f2001c04224868e538007b910edda85f401b5f3426465627ece9ebb2";
        const imageIpfsHash = "bafybeifdczqcw6cusmotlgr3mqij5b2kfiq7wi2screjvfp6cknlcu76ee";
        const nftIndex = (0, config_1.getNftIndex)();
        const assetName = `Algorand Education Badge #${nftIndex}`;
        const unitName = "AEB1";
        const imageURL = `ipfs://${imageIpfsHash}#arc3`;
        const assetDescription = "This is an NFT badge for Algorand Education";
        const imageIntegrity = `sha256-${imageSHA256}`;
        const properties = { level: 1, type: "education", blockchain: "Algorand" };
        const metadata = {
            name: assetName,
            description: assetDescription,
            image: imageURL,
            image_integrity: imageIntegrity,
            image_mimetype: imageMimeType,
            properties: properties,
        };
        const metadata_pin_res = yield pinJson(metadata);
        if (metadata_pin_res.IpfsHash) {
            const metadataURL = `ipfs://${metadata_pin_res.IpfsHash}#arc3`;
            const suggestedParams = yield config_1.algodClient.getTransactionParams().do();
            const nft_txn = algosdk_1.default.makeAssetCreateTxnWithSuggestedParamsFromObject({
                sender: config_1.tresuryWallet.addr,
                suggestedParams,
                defaultFrozen: false,
                unitName: unitName,
                assetName: assetName,
                manager: config_1.tresuryWallet.addr,
                reserve: config_1.tresuryWallet.addr,
                freeze: config_1.tresuryWallet.addr,
                clawback: config_1.tresuryWallet.addr,
                assetURL: metadataURL,
                total: 1,
                decimals: 0,
            });
            const signed_nft_txn = nft_txn.signTxn(config_1.tresuryWallet.sk);
            try {
                yield config_1.algodClient.sendRawTransaction(signed_nft_txn).do();
                const result = yield algosdk_1.default.waitForConfirmation(config_1.algodClient, nft_txn.txID().toString(), 3);
                var confirmedRound = Number(result.confirmedRound);
                (0, config_1.incrementNftIndex)();
                return res.status(200).json({
                    message: `NFT Minted Successfully with Id ${result.assetIndex}`,
                    txId: nft_txn.txID(),
                    assetId: Number(result.assetIndex),
                    round: confirmedRound,
                });
            }
            catch (e) {
                return res.status(500).json({
                    message: `Error Occured While Sending Transaction: ${e.message}`,
                });
            }
        }
        else {
            return res
                .status(500)
                .json({ message: "Failed to Upload Metadata to IPFS" });
        }
    }
    catch (e) {
        return res.status(500).json({ message: `Error Occured: ${e.message}` });
    }
}));
app.post("/claim-nft", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (!data.receiver || !data.assetId) {
        return res
            .status(500)
            .json({ message: "receiver and assetId are required" });
    }
    const assetId = Number(data.assetId);
    if (!algosdk_1.default.isValidAddress(data.receiver)) {
        return res.status(500).json({ message: "Invalid receiver address" });
    }
    const holdings = yield config_1.indexerClient.lookupAccountAssets(config_1.tresuryWallet.addr).do();
    let isCreated = false;
    let assetHolding = 0;
    for (let i = 0; i < holdings.assets.length; i++) {
        if (Number(holdings.assets[i].assetId) === assetId) {
            isCreated = true;
            assetHolding = Number(holdings.assets[i].amount);
            break;
        }
    }
    if (!isCreated) {
        return res.status(500).json({ message: "Invalid assetID" });
    }
    if (assetHolding <= 0) {
        return res.status(500).json({ message: "NFT Already Claimed" });
    }
    const assetDetails = yield config_1.indexerClient.lookupAssetByID(assetId).do();
    const decimals = assetDetails.asset.params.decimals;
    const receiver = data.receiver;
    const quantity = Number(1);
    try {
        const txn = algosdk_1.default.makeAssetTransferTxnWithSuggestedParamsFromObject({
            sender: config_1.tresuryWallet.addr,
            receiver: receiver,
            amount: quantity * Math.pow(10, decimals),
            assetIndex: assetId,
            suggestedParams: yield config_1.algodClient.getTransactionParams().do(),
        });
        const signedTxn = txn.signTxn(config_1.tresuryWallet.sk);
        yield config_1.algodClient.sendRawTransaction(signedTxn).do();
        const result = yield algosdk_1.default.waitForConfirmation(config_1.algodClient, txn.txID(), 3);
        return res.status(200).json({
            message: `NFT Transferred Successfully to ${receiver}`,
            txId: txn.txID(),
            round: Number(result.confirmedRound),
        });
    }
    catch (error) {
        return res.status(500).json({ message: `Error Occured: ${error.message}` });
    }
}));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
