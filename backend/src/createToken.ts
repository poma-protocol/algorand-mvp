import algosdk from "algosdk";
import { tresuryWallet, algodClient } from "./config";

(async () => {
  const decimals = 6;
  const assetCreateTxn =
    algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      sender: tresuryWallet.addr,
      assetName: "POMA",
      unitName: "POMA",
      total: 1000000 * (10 ** decimals),
      decimals: decimals,
      defaultFrozen: false,
      manager: tresuryWallet.addr,
      reserve: tresuryWallet.addr,
      freeze: tresuryWallet.addr,
      clawback: tresuryWallet.addr,
      suggestedParams: await algodClient.getTransactionParams().do(),
    });

  const signedAssetCreateTxn = assetCreateTxn.signTxn(tresuryWallet.sk);

  await algodClient.sendRawTransaction(signedAssetCreateTxn).do();

  const result = await algosdk.waitForConfirmation(algodClient, assetCreateTxn.txID(), 3);
  console.log(`Txn Id: ${assetCreateTxn.txID()}\nAsset Id: ${result.assetIndex}`);
})();
