import algosdk from "algosdk";

const account = algosdk.generateAccount();

console.log(`account address: ${account.addr.toString()}
    account sk: ${algosdk.secretKeyToMnemonic(account.sk)}
`);