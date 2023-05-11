import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { Account } from "@ledgerhq/types-live";
import { TransactionStatus } from "@ledgerhq/live-common/generated/types";
import { Transaction } from "@ledgerhq/live-common/families/bitcoin/types";
import { getAccountBridge } from "@ledgerhq/live-common/bridge/index";
import { getUTXOStatus } from "@ledgerhq/live-common/families/bitcoin/logic";
import TrackPage from "~/renderer/analytics/TrackPage";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import Text from "~/renderer/components/Text";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { PickingStrategy } from "./PickingStrategy";
import { CoinControlRow } from "./CoinControlRow";
import Checkbox from "~/renderer/components/CheckBox";
import { Flex } from "@ledgerhq/react-ui";


export const CheckBoxContainer: ThemedComponent<{ state: string }> = styled(Flex)`
  & > div {
    column-gap: 15px;
  }
  & span {
    font-size: 14px;
    line-height: 18px;
  }
  border-radius: 8px;
  background-color: ${p => p.theme.colors.neutral.c30};
  :hover {
    background-color: ${p => p.theme.colors.primary.c10};
  }
`;


type Props = {
  isOpened?: boolean;
  onClose: () => void;
  account: Account;
  transaction: Transaction;
  onChange: (a: Transaction) => void;
  updateTransaction: (updater: any) => void;
  status: TransactionStatus;
};
const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${p => p.theme.colors.palette.text.shade10};
  margin: 20px 0;
`;
const CoinControlModal = ({
  isOpened,
  onClose,
  account,
  transaction,
  onChange,
  status,
  updateTransaction,
}: Props) => {
  const [filterordinals, setFilterordinals] = useState(false);
  const onClickLink = useCallback(() => openURL(urls.coinControl), []);
  if (!account.bitcoinResources) return null;
  const { bitcoinResources } = account;
  const { utxoStrategy } = transaction;
  const totalExcludedUTXOS = account.bitcoinResources?.utxos
    .map(u => getUTXOStatus(u, utxoStrategy))
    .filter(({ excluded }) => excluded).length;
  const bridge = getAccountBridge(account);
  const errorKeys = Object.keys(status.errors);
  const error = errorKeys.length ? status.errors[errorKeys[0]] : null;
  const returning = (status.txOutputs || []).find(output => !!output.path || !!output.isChange);
  return (
    <Modal width={700} isOpened={isOpened} centered onClose={onClose}>
      <TrackPage category="Modal" name="BitcoinCoinControl" />
      <ModalBody
        width={700}
        title={<Trans i18nKey="bitcoin.modalTitle" />}
        onClose={onClose}
        render={() => (
          <Box flow={2}>
            <PickingStrategy
              transaction={transaction}
              account={account}
              onChange={onChange}
              status={status}
            />

            <Separator />
            <Box mt={0} mb={4} horizontal alignItem="center" justifyContent="space-between">
              <Text color="palette.text.shade50" ff="Inter|Regular" fontSize={13}>
                <Trans i18nKey="bitcoin.selected" />
              </Text>
              <Box horizontal alignItem="center">
                <Text
                  color="palette.text.shade50"
                  ff="Inter|Medium"
                  fontSize={13}
                  style={{
                    paddingRight: 5,
                  }}
                >
                  <Trans i18nKey="bitcoin.amount" />
                </Text>
                <Text ff="Inter|Medium" fontSize={13}>
                  <FormattedVal
                    disableRounding
                    val={status.totalSpent}
                    unit={account.unit}
                    showCode
                    fontSize={4}
                    color="palette.text.shade100"
                  />
                </Text>
              </Box>
            </Box>

            <Box flow={2}>
              {bitcoinResources.utxos.map(utxo => (
                <CoinControlRow
                  key={utxo.hash}
                  utxoStrategy={utxoStrategy}
                  totalExcludedUTXOS={totalExcludedUTXOS}
                  utxo={utxo}
                  updateTransaction={updateTransaction}
                  bridge={bridge}
                  status={status}
                  account={account}
                  filterordinals={filterordinals}
                />
              ))}
            </Box>
          </Box>
        )}
        renderFooter={() => (
          <>
            {error ? null : (
              <Box
                flow={4}
                alignItems="center"
                horizontal
                style={{
                  flexBasis: "50%",
                }}
              >
                <Box grow>
                  <Box horizontal alignItems="center" mb={2}>
                    <Box
                      style={{
                        flexBasis: "40%",
                      }}
                    >
                      <Text ff="Inter|Medium" fontSize={3} color="palette.text.shade50">
                        <Trans i18nKey="bitcoin.toSpend" />
                      </Text>
                    </Box>
                    <FormattedVal
                      disableRounding
                      val={status.totalSpent}
                      unit={account.unit}
                      showCode
                      fontSize={4}
                      ff="Inter|SemiBold"
                      color="palette.text.shade100"
                    />
                  </Box>
                  <Box horizontal alignItems="center">
                    <Box
                      style={{
                        flexBasis: "40%",
                      }}
                    >
                      <Text ff="Inter|Medium" fontSize={3} color="palette.text.shade50">
                        <Trans i18nKey="bitcoin.toReturn" />
                      </Text>
                    </Box>
                    <FormattedVal
                      disableRounding
                      val={returning ? returning.value : 0}
                      unit={account.unit}
                      showCode
                      fontSize={4}
                      ff="Inter|SemiBold"
                      color="palette.text.shade100"
                    />
                  </Box>
                </Box>
              </Box>
            )}
            <Box grow />
            <span style={{marginRight: "200px"}}>
              <Checkbox isChecked ={filterordinals} onChange={()=>{setFilterordinals(!filterordinals);}} />
              <Text ff="Inter|Medium" style={{marginLeft: "10px"}} fontSize={4} color={"#8b80db"}>
                {"Filter ordinals utxo"}
              </Text>
            </span>
            <LinkWithExternalIcon onClick={onClickLink}>
              <Trans i18nKey="bitcoin.whatIs" />
            </LinkWithExternalIcon>
            <Button primary onClick={onClose}>
              <Trans i18nKey="common.done" />
            </Button>
          </>
        )}
      />
    </Modal>
  );
};
export default CoinControlModal;
