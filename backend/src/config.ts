import algosdk from "algosdk";
import { config } from "dotenv";
import * as fs from 'fs';
import * as path from 'path';
config();
const tresuryWalletMnemonic = process.env.TRESURY_WALLET_MNEMONIC || "";
if (tresuryWalletMnemonic === "") { throw new Error("TRESURY_WALLET_MNEMONIC is required"); }
export const tokenId = parseInt(process.env.TOKEN_ID || "0");
if (tokenId === 0) { throw new Error("TOKEN_ID is required"); }
export const tresuryWallet = algosdk.mnemonicToSecretKey(tresuryWalletMnemonic);

export const algodClient = new algosdk.Algodv2("a".repeat(64), "https://testnet-api.4160.nodely.dev", 443);
export const indexerClient = new algosdk.Indexer("a".repeat(64), "https://testnet-idx.4160.nodely.dev", 443);

export const PINATA_KEY = process.env.PINATA_KEY || "";
export const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || "";


// Define the file path for "nftIndex"
const filePath = path.join(__dirname, 'nftIndex');

// Function to read and format the number in the file
export function getNftIndex(): string {
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
export function incrementNftIndex(): void {
  // Get the current number from the file
  const currentIndex = getNftIndex();

  // Convert the number back to a regular integer
  const currentNumber = parseInt(currentIndex, 10);

  // Increment the number and update the file
  const newNumber = currentNumber + 1;
  fs.writeFileSync(filePath, newNumber.toString());
}
