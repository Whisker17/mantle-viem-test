import {
  publicActionsL2,
  walletActionsL1,
  walletActionsL2,
  publicActionsL1,
} from "mantle-viem-test";
import { mantleSepoliaTestnet } from "mantle-viem-test/chains";
import { createPublicClient, createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) throw new Error("PRIVATE_KEY is missing in .env");

export const account = privateKeyToAccount(privateKey as `0x${string}`);

export const publicClientL1 = createPublicClient({
  chain: sepolia,
  transport: http(),
}).extend(publicActionsL1());

export const walletClientL1 = createWalletClient({
  account,
  chain: sepolia,
  transport: http(),
}).extend(walletActionsL1());

export const publicClientL2 = createPublicClient({
  chain: mantleSepoliaTestnet,
  transport: http(),
}).extend(publicActionsL2());

export const walletClientL2 = createWalletClient({
  account,
  chain: mantleSepoliaTestnet,
  transport: http(),
}).extend(walletActionsL2());
