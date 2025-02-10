import "dotenv/config";
import { getL2TransactionHashes } from "mantle-viem-test";
import { mantleSepoliaTestnet } from "mantle-viem-test/chains";
import { publicClientL1, publicClientL2, walletClientL1 } from "./config.ts";
import { parseEther } from "viem";

console.log("Deposit Starts!!!!!!!");

// Execute the deposit transaction on the L1.
const depositHash = await walletClientL1.depositETH({
  request: {
    amount: parseEther("0.01"),
  },
  targetChain: mantleSepoliaTestnet,
});
console.log("The deposit hash is:", depositHash);

// Wait for the L1 transaction to be processed.
const depositReceipt = await publicClientL1.waitForTransactionReceipt({
  hash: depositHash,
});
console.log("The deposit L1 Tx is processed.");

// Get the L2 transaction hash from the L1 transaction receipt.
const [l2Hash] = getL2TransactionHashes(depositReceipt);
console.log("The deposit L2 Hash is:", l2Hash);

// Wait for the L2 transaction to be processed.
const depositL2Receipt = await publicClientL2.waitForTransactionReceipt({
  hash: l2Hash,
});

console.log("The deposit L2 Tx is processed.");

console.log("Deposit Finished");
