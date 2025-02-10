import { getL2TransactionHashes } from "mantle-viem-test";
import { mantleSepoliaTestnet } from "mantle-viem-test/chains";
import {
  account,
  publicClientL1,
  publicClientL2,
  walletClientL1,
  walletClientL2,
} from "./config.ts";
import { parseEther } from "viem";

console.log("Withdrawal Starts!!!!!");

const l2ETH = "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111";

// Execute the initiate ETH withdrawal transaction on the L2.
const withdrawalHash = await walletClientL2.initiateETHWithdrawal({
  account,
  request: {
    amount: parseEther("0.1"),
  },
});

console.log("The withdrawal L2 Tx hash is: ", withdrawalHash);

// Wait for the initiate withdrawal transaction receipt.
const withdrawalReceipt = await publicClientL2.waitForTransactionReceipt({
  hash: withdrawalHash,
});

console.log("The withdrawal L2 Tx is processed.");

// Wait until the withdrawal is ready to prove.
const { output, withdrawal } = await publicClientL1.waitToProve({
  receipt: withdrawalReceipt,
  targetChain: walletClientL2.chain,
});
console.log("The withdrawal L2 Tx is waiting for proving");

// Build parameters to prove the withdrawal on the L2.
const proveArgs = await publicClientL2.buildProveWithdrawal({
  output,
  withdrawal,
});

console.log("The withdrawal prove Tx paras are built.");

// Prove the withdrawal on the L1.
const proveHash = await walletClientL1.proveWithdrawal(proveArgs);

console.log("The withdrawal prove tx hash is: ", proveHash);

// Wait until the prove withdrawal is processed.
const proveReceipt = await publicClientL1.waitForTransactionReceipt({
  hash: proveHash,
});
console.log("The withdrawal prove Tx is processed.");

// Wait until the withdrawal is ready to finalize.
await publicClientL1.waitToFinalize({
  targetChain: walletClientL2.chain,
  withdrawalHash: withdrawal.withdrawalHash,
});
console.log("The withdrawal Tx is processed.");

// Finalize the withdrawal.
const finalizeHash = await walletClientL1.finalizeWithdrawal({
  targetChain: walletClientL2.chain,
  withdrawal,
});
console.log("The withdrawal Tx hash is: ", finalizeHash);

// Wait until the withdrawal is finalized.
const finalizeReceipt = await publicClientL1.waitForTransactionReceipt({
  hash: finalizeHash,
});

console.log("The withdrawal Tx is finalized.");
