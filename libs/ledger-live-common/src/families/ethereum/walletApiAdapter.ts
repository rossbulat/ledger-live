import { EthereumTransaction as WalletAPIEthereumTransaction } from "@ledgerhq/wallet-api-core";
import { Account, AccountLike } from "@ledgerhq/types-live";
import {
  AreFeesProvided,
  ConvertToLiveTransaction,
  GetWalletAPITransactionSignFlowInfos,
} from "../../wallet-api/types";
import { Transaction as EthTx } from "./types";
import { Transaction as EvmTx } from "../evm/types";
import { isTokenAccount } from "../../account";
import { createTransaction } from "../evm/createTransaction";

const CAN_EDIT_FEES = true;

type Transaction = EthTx | EvmTx;

const areFeesProvided: AreFeesProvided<WalletAPIEthereumTransaction> = (tx) =>
  !!(tx.gasLimit || tx.gasPrice || tx.maxFeePerGas || tx.maxPriorityFeePerGas);

const convertToLiveTransaction: ConvertToLiveTransaction<
  WalletAPIEthereumTransaction,
  Transaction
> = ({ tx, account, parentAccount }) => {
  const hasFeesProvided = areFeesProvided(tx);

  const accountFamily = isTokenAccount(account)
    ? (parentAccount as Account).currency.family
    : account.currency.family;

  const liveTx: Partial<Transaction> =
    accountFamily === "ethrereum"
      ? {
          ...tx,
          userGasLimit: tx.gasLimit,
        }
      : convertToEvmLiveTransaction(tx, account);

  return hasFeesProvided ? { ...liveTx, feesStrategy: "custom" } : liveTx;
};

const getWalletAPITransactionSignFlowInfos: GetWalletAPITransactionSignFlowInfos<
  WalletAPIEthereumTransaction,
  Transaction
> = (params) => {
  return {
    canEditFees: CAN_EDIT_FEES,
    liveTx: convertToLiveTransaction(params),
    hasFeesProvided: areFeesProvided(params.tx),
  };
};

export default { getWalletAPITransactionSignFlowInfos };

function convertToEvmLiveTransaction(
  tx: WalletAPIEthereumTransaction,
  account: AccountLike
): Partial<EvmTx> {
  const liveTx: Partial<EvmTx> = {
    ...createTransaction(account),
    nonce: tx.nonce,
    amount: tx.amount,
    recipient: tx.recipient,
    data: tx.data,
    gasLimit: tx.gasLimit,
  };

  // EIP-1559 or Legacy?
  if (tx.maxPriorityFeePerGas || tx.maxFeePerGas) {
    liveTx.maxPriorityFeePerGas = tx.maxPriorityFeePerGas;
    liveTx.maxFeePerGas = tx.maxFeePerGas;
  } else {
    liveTx.type = 0;
    liveTx.gasPrice = tx.gasPrice;
  }

  return liveTx;
}
