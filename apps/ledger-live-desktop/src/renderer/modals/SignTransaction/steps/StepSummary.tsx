import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import {
  getAccountCurrency,
  getAccountName,
  getAccountUnit,
  getMainAccount,
} from "@ledgerhq/live-common/account/index";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Ellipsis from "~/renderer/components/Ellipsis";
import FormattedVal from "~/renderer/components/FormattedVal";
import Text from "~/renderer/components/Text";
import TranslatedError from "~/renderer/components/TranslatedError";
import IconExclamationCircle from "~/renderer/icons/ExclamationCircle";
import IconQrCode from "~/renderer/icons/QrCode";
import IconWallet from "~/renderer/icons/Wallet";
import { rgba } from "~/renderer/styles/helpers";
import CounterValue from "~/renderer/components/CounterValue";
import Alert from "~/renderer/components/Alert";
import RecipientField from "../RecipientField";
import { StepProps } from "../types";
import AccountTagDerivationMode from "~/renderer/components/AccountTagDerivationMode";
import { TransactionStatusCommon } from "@ledgerhq/types-live";
import { Transaction } from "@ledgerhq/live-common/generated/types";

const FromToWrapper = styled.div``;
const Circle = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 32px;
  background-color: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
  color: ${p => p.theme.colors.palette.primary.main};
  align-items: center;
  display: flex;
  justify-content: center;
  margin-right: 12px;
`;
const VerticalSeparator = styled.div`
  height: 18px;
  background: ${p => p.theme.colors.palette.text.shade20};
  width: 1px;
  margin: 1px 0px 0px 15px;
`;
const Separator = styled.div`
  height: 1px;
  background: ${p => p.theme.colors.palette.text.shade20};
  width: 100%;
  margin: 15px 0;
`;
const WARN_FROM_UTXO_COUNT = 50;
export default class StepSummary extends PureComponent<StepProps> {
  render() {
    const { account, parentAccount, transaction, status, error, warning } = this.props;
    if (!account) return null;
    const mainAccount = getMainAccount(account, parentAccount);
    if (!mainAccount || !transaction) return null;
    const {
      estimatedFees,
      amount,
      totalSpent,
      warnings,
      txInputs,
    } = status as TransactionStatusCommon & { txInputs: unknown[] };
    const feeTooHigh = warnings.feeTooHigh;
    const currency = getAccountCurrency(account);
    const feesUnit = getAccountUnit(mainAccount);
    const feesCurrency = getAccountCurrency(mainAccount);
    const unit = getAccountUnit(account);
    const utxoLag = txInputs ? txInputs.length >= WARN_FROM_UTXO_COUNT : null;
    const hasNonEmptySubAccounts =
      account.type === "Account" &&
      (account.subAccounts || []).some(subAccount => subAccount.balance.gt(0));

    const memo = (transaction as Transaction & { memo?: React.ReactNode }).memo;
    return (
      <Box flow={4} mx={40}>
        <TrackPage category="Sign Flow" name="Step Summary" />
        {utxoLag ? (
          <Alert type="warning">
            <Trans i18nKey="send.steps.details.utxoLag" />
          </Alert>
        ) : null}
        {transaction.useAllAmount && hasNonEmptySubAccounts ? (
          <Alert type="primary">
            <Trans
              i18nKey="send.steps.details.subaccountsWarning"
              values={{
                currency: currency.name,
              }}
            />
          </Alert>
        ) : null}
        {error || warning ? (
          <Alert type={error ? "error" : "warning"}>
            <TranslatedError error={error || warning} />
          </Alert>
        ) : null}
        <FromToWrapper>
          <Box>
            <Box horizontal alignItems="center">
              <Circle>
                <IconWallet size={14} />
              </Circle>
              <Box flex="1">
                <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
                  <Trans i18nKey="send.steps.details.from" />
                </Text>
                <Box horizontal alignItems="center">
                  <div
                    style={{
                      marginRight: 7,
                    }}
                  >
                    <CryptoCurrencyIcon size={16} currency={currency} />
                  </div>
                  <Text
                    ff="Inter"
                    color="palette.text.shade100"
                    fontSize={4}
                    style={{
                      flex: 1,
                    }}
                  >
                    {getAccountName(account)}
                  </Text>
                  <AccountTagDerivationMode account={account} />
                </Box>
              </Box>
            </Box>
            <VerticalSeparator />
            <Box horizontal alignItems="center">
              <Circle>
                <IconQrCode size={14} />
              </Circle>
              <RecipientField
                account={account}
                parentAccount={parentAccount}
                transaction={transaction}
              />
            </Box>
          </Box>
          <Separator />
          {memo && (
            <Box horizontal alignItems="center" mb={2}>
              <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
                <Trans i18nKey="operationDetails.extra.memo" />
              </Text>
              <Ellipsis ml={2}>
                <Text ff="Inter|Medium" fontSize={4}>
                  {memo}
                </Text>
              </Ellipsis>
            </Box>
          )}
          <Box horizontal justifyContent="space-between" mb={2}>
            <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
              <Trans i18nKey="send.steps.details.amount" />
            </Text>
            <Box>
              <FormattedVal
                color={"palette.text.shade80"}
                disableRounding
                unit={unit}
                val={amount}
                fontSize={4}
                inline
                showCode
                alwaysShowValue
              />
              <Box textAlign="right">
                <CounterValue
                  color="palette.text.shade60"
                  fontSize={3}
                  currency={currency}
                  value={amount}
                  alwaysShowSign={false}
                  subMagnitude={1}
                  alwaysShowValue
                />
              </Box>
            </Box>
          </Box>
          <Box horizontal justifyContent="space-between">
            <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
              <Trans i18nKey="send.steps.details.fees" />
            </Text>
            <Box>
              <FormattedVal
                color={feeTooHigh ? "warning" : "palette.text.shade80"}
                disableRounding
                unit={feesUnit}
                val={estimatedFees}
                fontSize={4}
                inline
                showCode
                alwaysShowValue
              />
              <Box textAlign="right">
                <CounterValue
                  color={feeTooHigh ? "warning" : "palette.text.shade60"}
                  fontSize={3}
                  currency={feesCurrency}
                  value={estimatedFees}
                  alwaysShowSign={false}
                  subMagnitude={1}
                  alwaysShowValue
                />
              </Box>
            </Box>
          </Box>
          {feeTooHigh ? (
            <Box horizontal justifyContent="flex-end" alignItems="center" color="warning">
              <IconExclamationCircle size={10} />
              <Text
                ff="Inter|Medium"
                fontSize={2}
                style={{
                  marginLeft: "5px",
                }}
              >
                <TranslatedError error={feeTooHigh} />
              </Text>
            </Box>
          ) : null}

          {!totalSpent.eq(amount) ? (
            <>
              <Separator />
              <Box horizontal justifyContent="space-between">
                <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
                  <Trans i18nKey="send.totalSpent" />
                </Text>

                <Box>
                  <FormattedVal
                    color={"palette.text.shade80"}
                    disableRounding
                    unit={unit}
                    val={totalSpent}
                    fontSize={4}
                    inline
                    showCode
                    alwaysShowValue
                  />
                  <Box textAlign="right">
                    <CounterValue
                      color="palette.text.shade60"
                      fontSize={3}
                      currency={currency}
                      value={totalSpent}
                      alwaysShowSign={false}
                      subMagnitude={1}
                      alwaysShowValue
                    />
                  </Box>
                </Box>
              </Box>
            </>
          ) : null}
        </FromToWrapper>
      </Box>
    );
  }
}
export class StepSummaryFooter extends PureComponent<StepProps> {
  onNext = async () => {
    const { transitionTo } = this.props;
    transitionTo("device");
  };

  render() {
    const { account, status, bridgePending } = this.props;
    if (!account) return null;
    const { errors } = status;
    const canNext = !bridgePending && !Object.keys(errors).length;
    return (
      <>
        <Button
          id={"sign-summary-continue-button"}
          primary
          disabled={!canNext}
          onClick={this.onNext}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      </>
    );
  }
}
