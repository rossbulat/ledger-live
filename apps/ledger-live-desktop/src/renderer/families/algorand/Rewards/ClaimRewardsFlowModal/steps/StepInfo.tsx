import invariant from "invariant";
import React from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { StepProps } from "../types";
import { getAccountUnit } from "@ledgerhq/live-common/account/index";
import { formatCurrencyUnit } from "@ledgerhq/live-common/currencies/index";
import { localeSelector } from "~/renderer/reducers/settings";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import Alert from "~/renderer/components/Alert";
import Text from "~/renderer/components/Text";
import ClaimRewardsIllu from "~/renderer/images/rewards.svg";
import Image from "~/renderer/components/Image";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";
export default function StepInfo({ account, transaction, warning, error }: StepProps) {
  invariant(
    account && account.algorandResources && transaction,
    "account and transaction required",
  );
  const unit = getAccountUnit(account);
  const locale = useSelector(localeSelector);
  const { algorandResources } = account;
  const { rewards } = algorandResources || {};
  const formattedRewards = formatCurrencyUnit(unit, rewards, {
    showCode: true,
    locale,
  });
  return (
    <Box flow={1}>
      <TrackPage category="OptIn Flow" name="Step 1" />
      {warning && !error ? <ErrorBanner error={warning} warning /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      <Box px={5} py={2}>
        <Box horizontal justifyContent="center" mb={4}>
          <Image alt="" resource={ClaimRewardsIllu} width="100" />
        </Box>

        <Text textAlign="center" ff="Inter|Medium" fontSize={4}>
          <Trans
            i18nKey="algorand.claimRewards.flow.steps.info.description"
            values={{
              amount: formattedRewards,
            }}
          />
        </Text>
      </Box>

      <Alert type="primary">
        <Trans i18nKey="algorand.claimRewards.flow.steps.info.info" />
      </Alert>
    </Box>
  );
}
export function StepInfoFooter({
  transitionTo,
  account,
  parentAccount,
  onClose,
  status,
  bridgePending,
}: StepProps) {
  invariant(account, "account required");
  const { errors } = status;
  const hasErrors = Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;
  return (
    <>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
