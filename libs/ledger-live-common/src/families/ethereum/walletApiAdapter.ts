import { EthereumTransaction as WalletAPIEthereumTransaction } from "@ledgerhq/wallet-api-core";
import { Account } from "@ledgerhq/types-live";
import {
  AreFeesProvided,
  ConvertToLiveTransaction,
  GetWalletAPITransactionSignFlowInfos,
} from "../../wallet-api/types";
import { Transaction as EthTx } from "./types";
import { Transaction as EvmTx } from "../evm/types";
import { isTokenAccount } from "../../account";

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
      : convertToEvmLiveTransaction(tx);

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
  tx: WalletAPIEthereumTransaction
): Partial<EvmTx> {
  const params = {
    family: "evm" as const,
    nonce: tx.nonce,
    amount: tx.amount,
    recipient: tx.recipient,
    data: tx.data,
    gasLimit: tx.gasLimit,
  };

  return tx.maxPriorityFeePerGas || tx.maxFeePerGas
    ? {
        ...params,
        type: 2,
      }
    : { ...params, type: 0 };
}
