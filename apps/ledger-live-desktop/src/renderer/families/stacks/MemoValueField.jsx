// @flow

import React, { useCallback } from "react";
import { getAccountBridge } from "@ledgerhq/live-common/bridge/index";
import Input from "~/renderer/components/Input";
import invariant from "invariant";
import type { Account } from "@ledgerhq/types-live";
import type { Transaction, TransactionStatus } from "@ledgerhq/live-common/generated/types";
import { useTranslation } from "react-i18next";

const MemoValueField = ({
  onChange,
  account,
  transaction,
  status,
}: {
  onChange: string => void,
  account: Account,
  transaction: Transaction,

  status: TransactionStatus,
}) => {
  invariant(transaction.family === "stacks", "MemoField: stacks family expected");

  const { t } = useTranslation();

  const bridge = getAccountBridge(account);

  const onMemoValueChange = useCallback(
    memoValue => {
      onChange(bridge.updateTransaction(transaction, { memo: memoValue }));
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
      placeholder={t("families.stacks.memoPlaceholder")}
      onChange={onMemoValueChange}
      spellCheck="false"
    />
  );
};

export default MemoValueField;
