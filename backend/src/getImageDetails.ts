const fs = require("fs");
const mimelib = require("mime-types");
const cryptolib = require("crypto");
import { PINATA_KEY, PINATA_SECRET_KEY } from "./config";

async function getFileDetails(filePath: string) {
  try {
    // Read file asynchronously
    const data = await fs.promises.readFile(filePath);

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
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

async function calculateSHA256(blobContent: Blob): Promise<string> {
  try {
    var buffer = Buffer.from(await blobContent.arrayBuffer());
    const hash = cryptolib.createHash("sha256");
    hash.update(buffer);
    return hash.digest("hex");
  } catch (error: any) {
    throw error;
  }
}

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

async function pinFileToIPFS(
  blobContent: Blob,
  name: string,
  mimetype: string
) {
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
    pinata_api_key: PINATA_KEY,
    pinata_secret_api_key: PINATA_SECRET_KEY,
  };

  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: headers,
      body: formData,
    }
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data: PinataResponse = await response.json();
  return data;
}

(async () => {
  const image =
    "./src/NFT Certification.png";
  const image_details = await getFileDetails(image); // gets image details like blob,name,mimetypr
  const hash = await calculateSHA256(image_details.blobContent);
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
  const image_pin_res = await pinFileToIPFS(
    image_details.blobContent,
    image_details.filename || "",
    image_details.mimetype
  );

  console.log("image_pin_res:", image_pin_res); 
})();
