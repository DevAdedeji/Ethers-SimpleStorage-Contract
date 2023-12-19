const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  // HTTP://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binaray = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binaray, wallet);
  console.log("Deploying, please wait");
  const contract = await contractFactory.deploy();
  // Get number
  const currentFavoriteNumber = await contract.retrieveFavNumber();
  console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`);
  // Store fav number
  const transactionResponse = await contract.storeFavNumber("7");
  const transactionReceipt = await transactionResponse.wait(1);
  // Get updated number
  const updatedFavoriteNumber = await contract.retrieveFavNumber();
  console.log(`Updated Favorite Number: ${updatedFavoriteNumber.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
