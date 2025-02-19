import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getAccountBridge } from "@ledgerhq/live-common/bridge/index";
import Input from "~/renderer/components/Input";
import invariant from "invariant";
import { Account } from "@ledgerhq/types-live";
import { Transaction, TransactionStatus } from "@ledgerhq/live-common/generated/types";
const MemoValueField = ({
  onChange,
  account,
  transaction,
  status,
}: {
  onChange: (a: string) => void;
  account: Account;
  transaction: Transaction;
  status: TransactionStatus;
}) => {
  const { t } = useTranslation();
  invariant(transaction.family === "crypto_org", "MemoTypeField: Crypto.org family expected");
  const bridge = getAccountBridge(account);
  const onMemoValueChange = useCallback(
    memo => {
      onChange(
        bridge.updateTransaction(transaction, {
          memo,
        }),
      );
    },
    [onChange, transaction, bridge],
  );

  // We use transaction as an error here.
  // It will be usefull to block a memo wrong format
  // on the ledger-live mobile
  return (
    <Input
      warning={status.warnings.transaction}
      error={status.errors.transaction}
      value={transaction.memo}
      onChange={onMemoValueChange}
      placeholder={t("cryptoOrg.memoPlaceholder")}
    />
  );
};
export default MemoValueField;
