import React from "react";
import { Account } from "@ledgerhq/types-live";
import { Transaction, TransactionStatus } from "@ledgerhq/live-common/generated/types";
import byFamily from "~/renderer/generated/SendAmountFields";
type Props = {
  account: Account;
  transaction: Transaction;
  status: TransactionStatus;
  onChange: (a: Transaction) => void;
  updateTransaction: (updater: any) => void;
  [key: string]: unknown;
};
const AmountRelatedField = (props: Props) => {
  const module = byFamily[props.account.currency.family as keyof typeof byFamily];
  if (!module) return null;
  const Cmp = module.component as React.ComponentType<Props>;
  return <Cmp {...props} />;
};
export default AmountRelatedField;
