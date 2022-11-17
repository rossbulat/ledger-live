import { BigNumber } from "bignumber.js";
import {
  getCryptoCurrencyById,
  getTokenById,
  findTokenById,
} from "../currencies";
import { isAccountEmpty } from "./helpers";
import type { SwapOperation, SwapOperationRaw } from "../types";
import {
  emptyHistoryCache,
  generateHistoryFromOperations,
} from "./balanceHistoryCache";
import type {
  Account,
  AccountLike,
  AccountRaw,
  AccountRawLike,
  BalanceHistory,
  BalanceHistoryRaw,
  ChildAccount,
  ChildAccountRaw,
  Operation,
  OperationRaw,
  ProtoNFT,
  ProtoNFTRaw,
  SubAccount,
  SubAccountRaw,
  TokenAccount,
  TokenAccountRaw,
} from "@ledgerhq/types-live";

export function toBalanceHistoryRaw(b: BalanceHistory): BalanceHistoryRaw {
  return b.map(({ date, value }) => [date.toISOString(), value.toString()]);
}
export function fromBalanceHistoryRaw(b: BalanceHistoryRaw): BalanceHistory {
  return b.map(([date, value]) => ({
    date: new Date(date),
    value: parseFloat(value),
  }));
}
// STP: to add a composition in ledger-live-common
export const toOperationRaw = (
  {
    date,
    value,
    fee,
    subOperations,
    internalOperations,
    nftOperations,
    extra,
    id,
    hash,
    type,
    senders,
    recipients,
    blockHeight,
    blockHash,
    transactionSequenceNumber,
    accountId,
    hasFailed,
    contract,
    operator,
    standard,
    tokenId,
  }: Operation,
  preserveSubOperation?: boolean
): OperationRaw => {
  const copy: OperationRaw = {
    id,
    hash,
    type,
    senders,
    recipients,
    accountId,
    blockHash,
    blockHeight,
    extra: extra,
    date: date.toISOString(),
    value: value.toFixed(),
    fee: fee.toString(),
    contract,
    operator,
    standard,
    tokenId,
  };

  if (transactionSequenceNumber !== undefined) {
    copy.transactionSequenceNumber = transactionSequenceNumber;
  }

  if (hasFailed !== undefined) {
    copy.hasFailed = hasFailed;
  }

  if (subOperations && preserveSubOperation) {
    copy.subOperations = subOperations.map((o) => toOperationRaw(o));
  }

  if (internalOperations) {
    copy.internalOperations = internalOperations.map((o) => toOperationRaw(o));
  }

  if (nftOperations) {
    copy.nftOperations = nftOperations.map((o) => toOperationRaw(o));
  }

  return copy;
};
export const inferSubOperations = (
  txHash: string,
  subAccounts: SubAccount[]
): Operation[] => {
  const all: Operation[] = [];

  for (let i = 0; i < subAccounts.length; i++) {
    const ta = subAccounts[i];

    for (let j = 0; j < ta.operations.length; j++) {
      const op = ta.operations[j];

      if (op.hash === txHash) {
        all.push(op);
      }
    }

    for (let j = 0; j < ta.pendingOperations.length; j++) {
      const op = ta.pendingOperations[j];

      if (op.hash === txHash) {
        all.push(op);
      }
    }
  }

  return all;
};
// STP: to add a composition in ledger-live-common
export const fromOperationRaw = (
  {
    date,
    value,
    fee,
    extra,
    subOperations,
    internalOperations,
    nftOperations,
    id,
    hash,
    type,
    senders,
    recipients,
    blockHeight,
    blockHash,
    transactionSequenceNumber,
    hasFailed,
    contract,
    operator,
    standard,
    tokenId,
  }: OperationRaw,
  accountId: string,
  subAccounts?: SubAccount[] | null | undefined
): Operation => {
  const res: Operation = {
    id,
    hash,
    type,
    senders,
    recipients,
    accountId,
    blockHash,
    blockHeight,
    date: new Date(date),
    value: new BigNumber(value),
    fee: new BigNumber(fee),
    extra: extra || {},
    contract,
    operator,
    standard,
    tokenId,
  };

  if (transactionSequenceNumber !== undefined) {
    res.transactionSequenceNumber = transactionSequenceNumber;
  }

  if (hasFailed !== undefined) {
    res.hasFailed = hasFailed;
  }

  if (subAccounts) {
    res.subOperations = inferSubOperations(hash, subAccounts);
  } else if (subOperations) {
    res.subOperations = subOperations.map((o) =>
      fromOperationRaw(o, o.accountId)
    );
  }

  if (internalOperations) {
    res.internalOperations = internalOperations.map((o) =>
      fromOperationRaw(o, o.accountId)
    );
  }

  if (nftOperations) {
    res.nftOperations = nftOperations.map((o) =>
      fromOperationRaw(o, o.accountId)
    );
  }

  return res;
};

export function fromSwapOperationRaw(raw: SwapOperationRaw): SwapOperation {
  const { fromAmount, toAmount } = raw;
  return {
    ...raw,
    fromAmount: new BigNumber(fromAmount),
    toAmount: new BigNumber(toAmount),
  };
}
export function toSwapOperationRaw(so: SwapOperation): SwapOperationRaw {
  const { fromAmount, toAmount } = so;
  return {
    ...so,
    fromAmount: fromAmount.toString(),
    toAmount: toAmount.toString(),
  };
}
export function fromTokenAccountRaw(raw: TokenAccountRaw): TokenAccount {
  const {
    id,
    parentId,
    tokenId,
    starred,
    operations,
    pendingOperations,
    creationDate,
    balance,
    spendableBalance,
    compoundBalance,
    balanceHistoryCache,
    swapHistory,
    approvals,
  } = raw;
  const token = getTokenById(tokenId);

  const convertOperation = (op) => fromOperationRaw(op, id);

  const res = {
    type: "TokenAccount",
    id,
    parentId,
    token,
    starred: starred || false,
    balance: new BigNumber(balance),
    spendableBalance: spendableBalance
      ? new BigNumber(spendableBalance)
      : new BigNumber(balance),
    compoundBalance: compoundBalance
      ? new BigNumber(compoundBalance)
      : undefined,
    creationDate: new Date(creationDate || Date.now()),
    operationsCount:
      raw.operationsCount || (operations && operations.length) || 0,
    operations: (operations || []).map(convertOperation),
    pendingOperations: (pendingOperations || []).map(convertOperation),
    swapHistory: (swapHistory || []).map(fromSwapOperationRaw),
    approvals,
    balanceHistoryCache: balanceHistoryCache || emptyHistoryCache,
  };
  res.balanceHistoryCache = generateHistoryFromOperations(res as TokenAccount);
  return res as TokenAccount;
}
export function toTokenAccountRaw(ta: TokenAccount): TokenAccountRaw {
  const {
    id,
    parentId,
    token,
    starred,
    operations,
    operationsCount,
    pendingOperations,
    balance,
    spendableBalance,
    compoundBalance,
    balanceHistoryCache,
    swapHistory,
    approvals,
  } = ta;
  return {
    type: "TokenAccountRaw",
    id,
    parentId,
    starred,
    tokenId: token.id,
    balance: balance.toString(),
    spendableBalance: spendableBalance.toString(),
    compoundBalance: compoundBalance ? compoundBalance.toString() : undefined,
    balanceHistoryCache,
    creationDate: ta.creationDate.toISOString(),
    operationsCount,
    operations: operations.map((o) => toOperationRaw(o)),
    pendingOperations: pendingOperations.map((o) => toOperationRaw(o)),
    swapHistory: (swapHistory || []).map(toSwapOperationRaw),
    approvals,
  };
}
export function fromChildAccountRaw(raw: ChildAccountRaw): ChildAccount {
  const {
    id,
    name,
    parentId,
    currencyId,
    starred,
    creationDate,
    operations,
    operationsCount,
    pendingOperations,
    balance,
    address,
    balanceHistoryCache,
    swapHistory,
  } = raw;
  const currency = getCryptoCurrencyById(currencyId);

  const convertOperation = (op) => fromOperationRaw(op, id);

  const res: ChildAccount = {
    type: "ChildAccount",
    id,
    name,
    starred: starred || false,
    parentId,
    currency,
    address,
    balance: new BigNumber(balance),
    creationDate: new Date(creationDate || Date.now()),
    operationsCount: operationsCount || (operations && operations.length) || 0,
    operations: (operations || []).map(convertOperation),
    pendingOperations: (pendingOperations || []).map(convertOperation),
    swapHistory: (swapHistory || []).map(fromSwapOperationRaw),
    balanceHistoryCache: balanceHistoryCache || emptyHistoryCache,
  };
  res.balanceHistoryCache = generateHistoryFromOperations(res);
  return res;
}
export function toChildAccountRaw(ca: ChildAccount): ChildAccountRaw {
  const {
    id,
    name,
    parentId,
    starred,
    currency,
    operations,
    operationsCount,
    pendingOperations,
    balance,
    balanceHistoryCache,
    address,
    creationDate,
    swapHistory,
  } = ca;
  return {
    type: "ChildAccountRaw",
    id,
    name,
    starred,
    parentId,
    address,
    operationsCount,
    currencyId: currency.id,
    balance: balance.toString(),
    balanceHistoryCache,
    creationDate: creationDate.toISOString(),
    operations: operations.map((o) => toOperationRaw(o)),
    pendingOperations: pendingOperations.map((o) => toOperationRaw(o)),
    swapHistory: (swapHistory || []).map(toSwapOperationRaw),
  };
}
export function fromSubAccountRaw(raw: SubAccountRaw): SubAccount {
  switch (raw.type) {
    case "ChildAccountRaw":
      return fromChildAccountRaw(raw);

    case "TokenAccountRaw":
      return fromTokenAccountRaw(raw);

    default:
      throw new Error("invalid raw.type=" + (raw as SubAccountRaw).type);
  }
}
export function toSubAccountRaw(subAccount: SubAccount): SubAccountRaw {
  switch (subAccount.type) {
    case "ChildAccount":
      return toChildAccountRaw(subAccount);

    case "TokenAccount":
      return toTokenAccountRaw(subAccount);

    default:
      throw new Error(
        "invalid subAccount.type=" + (subAccount as SubAccount).type
      );
  }
}
export function fromAccountLikeRaw(
  rawAccountLike: AccountRawLike
): AccountLike {
  if ("type" in rawAccountLike) {
    //$FlowFixMe
    return fromSubAccountRaw(rawAccountLike);
  }

  //$FlowFixMe
  return fromAccountRaw(rawAccountLike);
}
export function toAccountLikeRaw(accountLike: AccountLike): AccountRawLike {
  switch (accountLike.type) {
    case "Account":
      return toAccountRaw(accountLike);

    default:
      return toSubAccountRaw(accountLike);
  }
}

// STP: to add a composition in ledger-live-common
export function fromAccountRaw(rawAccount: AccountRaw): Account {
  const {
    id,
    seedIdentifier,
    derivationMode,
    index,
    xpub,
    starred,
    used,
    freshAddress,
    freshAddressPath,
    freshAddresses,
    name,
    blockHeight,
    endpointConfig,
    currencyId,
    unitMagnitude,
    operations,
    operationsCount,
    pendingOperations,
    lastSyncDate,
    creationDate,
    balance,
    balanceHistoryCache,
    spendableBalance,
    subAccounts: subAccountsRaw,
    swapHistory,
    syncHash,
    nfts,
  } = rawAccount;
  const subAccounts =
    subAccountsRaw &&
    subAccountsRaw
      .map((ta) => {
        if (ta.type === "TokenAccountRaw") {
          if (findTokenById(ta.tokenId)) {
            return fromTokenAccountRaw(ta);
          }
        } else {
          return fromSubAccountRaw(ta);
        }
      })
      .filter(Boolean);
  const currency = getCryptoCurrencyById(currencyId);
  const unit =
    currency.units.find((u) => u.magnitude === unitMagnitude) ||
    currency.units[0];

  const convertOperation = (op) =>
    fromOperationRaw(op, id, subAccounts as SubAccount[]);

  const res: Account = {
    type: "Account",
    id,
    starred: starred || false,
    used: false,
    // filled again below
    seedIdentifier,
    derivationMode,
    index,
    freshAddress,
    freshAddressPath,
    freshAddresses: freshAddresses || [
      // in case user come from an old data that didn't support freshAddresses
      {
        derivationPath: freshAddressPath,
        address: freshAddress,
      },
    ],
    name,
    blockHeight,
    creationDate: new Date(creationDate || Date.now()),
    balance: new BigNumber(balance),
    spendableBalance: new BigNumber(spendableBalance || balance),
    operations: (operations || []).map(convertOperation),
    operationsCount: operationsCount || (operations && operations.length) || 0,
    pendingOperations: (pendingOperations || []).map(convertOperation),
    unit,
    currency,
    lastSyncDate: new Date(lastSyncDate || 0),
    swapHistory: [],
    syncHash,
    balanceHistoryCache: balanceHistoryCache || emptyHistoryCache,
    nfts: nfts?.map((n) => fromNFTRaw(n)),
  };
  res.balanceHistoryCache = generateHistoryFromOperations(res);

  if (typeof used === "undefined") {
    // old account data that didn't had the field yet
    res.used = !isAccountEmpty(res);
  } else {
    res.used = used;
  }

  if (xpub) {
    res.xpub = xpub;
  }

  if (endpointConfig) {
    res.endpointConfig = endpointConfig;
  }

  if (subAccounts) {
    res.subAccounts = subAccounts as SubAccount[];
  }

  if (swapHistory) {
    res.swapHistory = swapHistory.map(fromSwapOperationRaw);
  }

  return res;
}

// STP: to add a composition in ledger-live-common
export function toAccountRaw(account: Account): AccountRaw {
  const {
    id,
    seedIdentifier,
    xpub,
    name,
    starred,
    used,
    derivationMode,
    index,
    freshAddress,
    freshAddressPath,
    freshAddresses,
    blockHeight,
    currency,
    creationDate,
    operationsCount,
    operations,
    pendingOperations,
    unit,
    lastSyncDate,
    balance,
    balanceHistoryCache,
    spendableBalance,
    subAccounts,
    endpointConfig,
    swapHistory,
    syncHash,
    nfts,
  } = account;

  const res: AccountRaw = {
    id,
    seedIdentifier,
    name,
    starred,
    used,
    derivationMode,
    index,
    freshAddress,
    freshAddressPath,
    freshAddresses,
    blockHeight,
    syncHash,
    creationDate: creationDate.toISOString(),
    operationsCount,
    operations: (operations || []).map((o) => toOperationRaw(o)),
    pendingOperations: (pendingOperations || []).map((o) => toOperationRaw(o)),
    currencyId: currency.id,
    unitMagnitude: unit.magnitude,
    lastSyncDate: lastSyncDate.toISOString(),
    balance: balance.toFixed(),
    spendableBalance: spendableBalance.toFixed(),
    nfts: nfts?.map((n) => toNFTRaw(n)),
  };

  if (balanceHistoryCache) {
    res.balanceHistoryCache = balanceHistoryCache;
  }

  if (endpointConfig) {
    res.endpointConfig = endpointConfig;
  }

  if (xpub) {
    res.xpub = xpub;
  }

  if (subAccounts) {
    res.subAccounts = subAccounts.map(toSubAccountRaw);
  }

  if (swapHistory) {
    res.swapHistory = swapHistory.map(toSwapOperationRaw);
  }

  return res;
}

export function toNFTRaw({
  id,
  tokenId,
  amount,
  contract,
  standard,
  currencyId,
  metadata,
}: ProtoNFT): ProtoNFTRaw {
  return {
    id,
    tokenId,
    amount: amount.toFixed(),
    contract,
    standard,
    currencyId,
    metadata,
  };
}

export function fromNFTRaw({
  id,
  tokenId,
  amount,
  contract,
  standard,
  currencyId,
  metadata,
}: ProtoNFTRaw): ProtoNFT {
  return {
    id,
    tokenId,
    amount: new BigNumber(amount),
    contract,
    standard,
    currencyId,
    metadata,
  };
}
