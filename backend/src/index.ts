import express from "express";
import cors from "cors";
import algosdk from "algosdk";
import {
  tresuryWallet,
  tokenId,
  algodClient,
  indexerClient,
  PINATA_KEY,
  PINATA_SECRET_KEY,
  getNftIndex,
  incrementNftIndex,
} from "./config";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/token-transfer", async (req, res) => {
  const data = req.body;
  if (!data.receiver && !data.quantity) {
    return res
      .status(500)
      .json({ message: "receiver and quantity are required" });
  }
  if (!algosdk.isValidAddress(data.receiver)) {
    return res.status(500).json({ message: "Invalid receiver address" });
  }
  if (data.quantity <= 0) {
    return res.status(500).json({ message: "Invalid quantity" });
  }

  const assetDetails = await indexerClient.lookupAssetByID(tokenId).do();

  const decimals = assetDetails.asset.params.decimals;
  const receiver: string = data.receiver;
  const quantity: number = Number(data.quantity);

  try {
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      sender: tresuryWallet.addr,
      receiver: receiver,
      amount: quantity * 10 ** decimals,
      assetIndex: tokenId,
      suggestedParams: await algodClient.getTransactionParams().do(),
    });
    const signedTxn = txn.signTxn(tresuryWallet.sk);

    await algodClient.sendRawTransaction(signedTxn).do();

    const result = await algosdk.waitForConfirmation(
      algodClient,
      txn.txID(),
      3
    );
    return res.status(200).json({
      message: `${quantity} POMA Tokens Transferred Successfully to ${receiver}`,
      txId: txn.txID(),
      round: Number(result.confirmedRound),
    });
  } catch (error: any) {
    return res.status(500).json({ message: `Error Occured: ${error.message}` });
  }
});

app.post("/token-transfer-2", async (req, res) => {
  const data = req.body;
  if (!data.receiver && !data.referralCount) {
    return res
      .status(500)
      .json({ message: "receiver and referral Count are required" });
  }
  if (!algosdk.isValidAddress(data.receiver)) {
    return res.status(500).json({ message: "Invalid receiver address" });
  }
  if (Number(data.quantity) <= 0) {
    return res.status(500).json({ message: "Invalid referral Count" });
  }

  const assetDetails = await indexerClient.lookupAssetByID(tokenId).do();

  const decimals = assetDetails.asset.params.decimals;
  const receiver: string = data.receiver;
  const referralCount: number = Number(data.quantity);
  const rewardForEachReferral = 15;

  try {
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      sender: tresuryWallet.addr,
      receiver: receiver,
      amount: referralCount * rewardForEachReferral * 10 ** decimals,
      assetIndex: tokenId,
      suggestedParams: await algodClient.getTransactionParams().do(),
    });
    const signedTxn = txn.signTxn(tresuryWallet.sk);

    await algodClient.sendRawTransaction(signedTxn).do();

    const result = await algosdk.waitForConfirmation(
      algodClient,
      txn.txID(),
      3
    );
    return res.status(200).json({
      message: `Referals (${referralCount}) x Reward for Each Referral (${rewardForEachReferral}) = ${
        referralCount * rewardForEachReferral
      } POMA Tokens Transferred Successfully to ${receiver}`,
      txId: txn.txID(),
      round: Number(result.confirmedRound),
    });
  } catch (error: any) {
    return res.status(500).json({ message: `Error Occured: ${error.message}` });
  }
});

app.post("/token-transfer-3", async (req, res) => {
  const data = req.body;
  if (!data.receiver && !data.referralCount) {
    return res
      .status(500)
      .json({ message: "receiver and Number of On-Chain Transactions are required" });
  }
  if (!algosdk.isValidAddress(data.receiver)) {
    return res.status(500).json({ message: "Invalid receiver address" });
  }
  if (Number(data.quantity) <= 0) {
    return res.status(500).json({ message: "Invalid Number of On-Chain Transactions" });
  }

  const assetDetails = await indexerClient.lookupAssetByID(tokenId).do();

  const decimals = assetDetails.asset.params.decimals;
  const receiver: string = data.receiver;
  const referralCount: number = Number(data.quantity);
  const rewardForEachReferral = 0.1;

  try {
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      sender: tresuryWallet.addr,
      receiver: receiver,
      amount: referralCount * rewardForEachReferral * 10 ** decimals,
      assetIndex: tokenId,
      suggestedParams: await algodClient.getTransactionParams().do(),
    });
    const signedTxn = txn.signTxn(tresuryWallet.sk);

    await algodClient.sendRawTransaction(signedTxn).do();

    const result = await algosdk.waitForConfirmation(
      algodClient,
      txn.txID(),
      3
    );
    return res.status(200).json({
      message: `Referals (${referralCount}) x Reward for Each On-Chain Transaction (${rewardForEachReferral}) = ${
        referralCount * rewardForEachReferral
      } POMA Tokens Transferred Successfully to ${receiver}`,
      txId: txn.txID(),
      round: Number(result.confirmedRound),
    });
  } catch (error: any) {
    return res.status(500).json({ message: `Error Occured: ${error.message}` });
  }
});

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
}

async function pinJson(jsonData: any): Promise<PinataResponse> {
  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

  const payload = {
    pinataContent: jsonData,
  };

  const headers = {
    "Content-Type": "application/json",
    pinata_api_key: PINATA_KEY,
    pinata_secret_api_key: PINATA_SECRET_KEY,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data: PinataResponse = await response.json();
  return data;
}

app.post("/mint-nft", async (req, res) => {
  try {
    const imageMimeType = "image/png";
    const imageSHA256 =
      "2b791ca8f2001c04224868e538007b910edda85f401b5f3426465627ece9ebb2";
    const imageIpfsHash =
      "bafybeifdczqcw6cusmotlgr3mqij5b2kfiq7wi2screjvfp6cknlcu76ee";

    const nftIndex = getNftIndex();

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

    const metadata_pin_res = await pinJson(metadata);
    if (metadata_pin_res.IpfsHash) {
      const metadataURL = `ipfs://${metadata_pin_res.IpfsHash}#arc3`;
      const suggestedParams = await algodClient.getTransactionParams().do();
      const nft_txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        sender: tresuryWallet.addr,
        suggestedParams,
        defaultFrozen: false,
        unitName: unitName,
        assetName: assetName,
        manager: tresuryWallet.addr,
        reserve: tresuryWallet.addr,
        freeze: tresuryWallet.addr,
        clawback: tresuryWallet.addr,
        assetURL: metadataURL,
        total: 1,
        decimals: 0,
      });
      const signed_nft_txn = nft_txn.signTxn(tresuryWallet.sk);
      try {
        await algodClient.sendRawTransaction(signed_nft_txn).do();
        const result = await algosdk.waitForConfirmation(
          algodClient,
          nft_txn.txID().toString(),
          3
        );
        var confirmedRound = Number(result.confirmedRound);
        incrementNftIndex();
        return res.status(200).json({
          message: `NFT Minted Successfully with Id ${result.assetIndex}`,
          txId: nft_txn.txID(),
          assetId: Number(result.assetIndex),
          round: confirmedRound,
        });
      } catch (e: any) {
        return res.status(500).json({
          message: `Error Occured While Sending Transaction: ${e.message}`,
        });
      }
    } else {
      return res
        .status(500)
        .json({ message: "Failed to Upload Metadata to IPFS" });
    }
  } catch (e: any) {
    return res.status(500).json({ message: `Error Occured: ${e.message}` });
  }
});

app.post("/claim-nft", async (req, res) => {
  const data = req.body;
  if (!data.receiver || !data.assetId) {
    return res
      .status(500)
      .json({ message: "receiver and assetId are required" });
  }
  const assetId = Number(data.assetId);
  if (!algosdk.isValidAddress(data.receiver)) {
    return res.status(500).json({ message: "Invalid receiver address" });
  }
  const holdings = await indexerClient.lookupAccountAssets(tresuryWallet.addr).do();
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

  const assetDetails = await indexerClient.lookupAssetByID(assetId).do();

  const decimals = assetDetails.asset.params.decimals;
  const receiver: string = data.receiver;
  const quantity: number = Number(1);

  try {
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      sender: tresuryWallet.addr,
      receiver: receiver,
      amount: quantity * 10 ** decimals,
      assetIndex: assetId,
      suggestedParams: await algodClient.getTransactionParams().do(),
    });
    const signedTxn = txn.signTxn(tresuryWallet.sk);

    await algodClient.sendRawTransaction(signedTxn).do();

    const result = await algosdk.waitForConfirmation(
      algodClient,
      txn.txID(),
      3
    );
    return res.status(200).json({
      message: `NFT Transferred Successfully to ${receiver}`,
      txId: txn.txID(),
      round: Number(result.confirmedRound),
    });
  } catch (error: any) {
    return res.status(500).json({ message: `Error Occured: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
