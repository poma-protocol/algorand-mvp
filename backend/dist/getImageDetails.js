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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const mimelib = require("mime-types");
const cryptolib = require("crypto");
const config_1 = require("./config");
function getFileDetails(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Read file asynchronously
            const data = yield fs.promises.readFile(filePath);
            // Get filename from file path
            const filename = filePath.split("/").pop();
            // Determine mimetype of the file
            const mimetype = mimelib.lookup(filePath);
            // Create blob content from file data
            const blobContent = new Blob([data], { type: mimetype });
            return {
                blobContent,
                filename,
                mimetype,
            };
        }
        catch (error) {
            console.error("Error reading file:", error);
            throw error;
        }
    });
}
function calculateSHA256(blobContent) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var buffer = Buffer.from(yield blobContent.arrayBuffer());
            const hash = cryptolib.createHash("sha256");
            hash.update(buffer);
            return hash.digest("hex");
        }
        catch (error) {
            throw error;
        }
    });
}
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
function pinFileToIPFS(blobContent, name, mimetype) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new FormData();
        const file = new File([blobContent], name, { type: mimetype });
        formData.append("file", file);
        const pinataMetadata = JSON.stringify({
            name: name,
        });
        formData.append("pinataMetadata", pinataMetadata);
        const pinataOptions = JSON.stringify({
            cidVersion: 1,
        });
        formData.append("pinataOptions", pinataOptions);
        const headers = {
            pinata_api_key: config_1.PINATA_KEY,
            pinata_secret_api_key: config_1.PINATA_SECRET_KEY,
        };
        const response = yield fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: headers,
            body: formData,
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = yield response.json();
        return data;
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const image = "./src/NFT Certification.png";
    const image_details = yield getFileDetails(image); // gets image details like blob,name,mimetypr
    const hash = yield calculateSHA256(image_details.blobContent);
    console.log("Image Details:", image_details);
    console.log("SHA256 Hash:", hash);
    const readableStreamForFile = fs.createReadStream(image);
    const options = {
        pinataMetadata: {
            name: image_details.filename,
        },
        pinataOptions: {
            cidVersion: 0,
        },
    };
    const image_pin_res = yield pinFileToIPFS(image_details.blobContent, image_details.filename || "", image_details.mimetype);
    console.log("image_pin_res:", image_pin_res);
}))();
