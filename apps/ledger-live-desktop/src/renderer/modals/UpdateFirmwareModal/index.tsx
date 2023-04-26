import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { log } from "@ledgerhq/logs";
import { DeviceModelId, getDeviceModel } from "@ledgerhq/devices";
import { DeviceInfo, FirmwareUpdateContext } from "@ledgerhq/types-live";
import { withV3StyleProvider } from "~/renderer/styles/StyleProviderV3";
import { hasFinalFirmware } from "@ledgerhq/live-common/hw/hasFinalFirmware";
import logger from "~/renderer/logger";
import { Step as TypedStep } from "~/renderer/components/Stepper";
import StepResetDevice, { StepResetFooter } from "./steps/00-step-reset-device";
import StepPrepare from "./steps/01-step-prepare";
import StepFlashMcu from "./steps/02-step-flash-mcu";
import StepRestore from "./steps/02-step-restore";
import StepUpdating from "./steps/02-step-updating";
import { isDeviceLocalizationSupported } from "@ledgerhq/live-common/manager/localization";
import StepConfirmation, { StepConfirmFooter } from "./steps/03-step-confirmation";
import { Divider, Flex, FlowStepper, Text } from "@ledgerhq/react-ui";
import Disclaimer from "./Disclaimer";

type MaybeError = Error | undefined | null;

export type StepProps = {
  firmware?: FirmwareUpdateContext;
  appsToBeReinstalled: boolean;
  onDrawerClose: (reinstall?: boolean) => void;
  error?: Error;
  setError: (e: Error) => void;
  CLSBackup?: string;
  deviceModelId: DeviceModelId;
  deviceInfo: DeviceInfo;
  updatedDeviceInfo?: DeviceInfo;
  setUpdatedDeviceInfo: (d: DeviceInfo) => void;
  transitionTo: (step: StepId) => void;
  onRetry: () => void;
  setCLSBackup: (hexImage: string) => void;
};

export type StepId =
  | "idCheck"
  | "updateMCU"
  | "updating"
  | "finish"
  | "resetDevice"
  | "deviceLanguage";

type Step = TypedStep<StepId, StepProps>;

type Props = {
  withResetStep: boolean;
  withAppsToReinstall: boolean;
  onDrawerClose: (reinstall?: boolean) => void;
  firmware?: FirmwareUpdateContext;
  stepId: StepId;
  error?: Error | null;
  deviceModelId: DeviceModelId;
  deviceInfo: DeviceInfo;
  setFirmwareUpdateOpened: (isOpen: boolean) => void;
  // This is bad practice but it seems to be needed since we spread additional props in the stepper and down below…
  [key: string]: unknown;
};

const UpdateModal = ({
  stepId,
  deviceModelId,
  withResetStep,
  withAppsToReinstall,
  error,
  onDrawerClose,
  firmware,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const [stateStepId, setStateStepId] = useState<StepId>(stepId);
  const [nonce, setNonce] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [err, setErr] = useState<MaybeError>(error || null);
  const [CLSBackup, setCLSBackup] = useState<string>();
  const [updatedDeviceInfo, setUpdatedDeviceInfo] = useState<DeviceInfo | undefined>(undefined);
  const withFinal = useMemo(() => hasFinalFirmware(firmware?.final), [firmware]);

  const createSteps = useCallback(
    ({ withResetStep }: { withResetStep: boolean }) => {
      const prepareStep: Step = {
        id: "idCheck",
        label: firmware?.osu?.hash
          ? t("manager.modal.identifier")
          : t("manager.modal.steps.prepare"),
        component: StepPrepare,
      };

      const finalStep: Step = {
        id: "finish",
        label: t("addAccounts.breadcrumb.finish"),
        component: StepConfirmation,
        footer: StepConfirmFooter,
      };

      const mcuStep: Step = {
        id: "updateMCU",
        label: t("manager.modal.steps.updateMCU"),
        component: StepFlashMcu,
      };

      const restoreStep: Step = {
        id: "deviceLanguage",
        label: t("manager.modal.steps.restore"),
        component: StepRestore,
      };

      const updatingStep: Step = {
        id: "updating",
        label: t("manager.modal.steps.install"),
        component: StepUpdating,
      };

      const resetStep: Step = {
        id: "resetDevice",
        label: t("manager.modal.steps.reset"),
        component: StepResetDevice,
        footer: StepResetFooter,
      };

      const steps: Step[] = [];
      if (withResetStep) {
        steps.push(resetStep);
      }
      steps.push(prepareStep);
      if (firmware?.shouldFlashMCU || withFinal) {
        steps.push(mcuStep);
      } else {
        steps.push(updatingStep);
      }

      if (firmware && isDeviceLocalizationSupported(firmware.final.name, deviceModelId)) {
        steps.push(restoreStep);
      }

      steps.push(finalStep);
      return steps;
    },
    [t, firmware, withFinal, deviceModelId],
  );

  const steps = useMemo(() => createSteps({ withResetStep }), [createSteps, withResetStep]);

  const setError = useCallback(
    (e: Error) => {
      logger.critical(e);
      setErr(e);
    },
    [setErr],
  );

  const handleReset = useCallback(() => {
    setErr(null);
    setStateStepId(steps[0].id);
    setNonce(curr => curr++);
  }, [steps]);

  useEffect(() => {
    log("firmware-record-start");

    return () => {
      log("firmware-record-cancel");
    };
  }, []);

  const additionalProps = {
    ...props,
    onDrawerClose,
    onRetry: handleReset,

    setError,
    setCLSBackup,
    setUpdatedDeviceInfo,

    appsToBeReinstalled: withAppsToReinstall,
    CLSBackup,
    deviceModelId,
    error: err,
    firmware,
    updatedDeviceInfo,
  };

  const deviceModel = getDeviceModel(deviceModelId);

  return (
    <Flex
      key={nonce}
      flexDirection="column"
      rowGap={5}
      height="100%"
      overflowY="hidden"
      width="100%"
      flex={1}
      data-test-id="firmware-update-container"
    >
      <Text alignSelf="center" variant="h5Inter">
        {t("manager.modal.title", { productName: deviceModel.productName })}
      </Text>
      {showDisclaimer ? (
        <Disclaimer onContinue={() => setShowDisclaimer(false)} t={t} firmware={firmware} />
      ) : (
        <FlowStepper.Indexed
          activeKey={stateStepId}
          extraStepperContainerProps={{ px: 12 }}
          extraStepperProps={{ errored: !!error }}
          extraContainerProps={{ overflowY: "hidden" }}
          extraChildrenContainerProps={{ overflowY: "hidden" }}
          renderChildren={undefined}
        >
          {steps.map(step => (
            <FlowStepper.Indexed.Step key={step.id} itemKey={step.id} label={step.label as string}>
              <Flex
                flex={1}
                flexDirection="column"
                justifyContent="space-between"
                overflowY="hidden"
              >
                <Flex
                  flex={1}
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="stretch"
                  flexShrink={1}
                  overflowY="hidden"
                  px={12}
                >
                  <step.component {...additionalProps} transitionTo={setStateStepId} />
                </Flex>
                {step.footer ? (
                  <Flex flexDirection="column" alignSelf="stretch">
                    <Divider />
                    <Flex
                      px={12}
                      alignSelf="stretch"
                      flexDirection="row"
                      justifyContent="space-between"
                      pt={4}
                      pb={1}
                    >
                      <Flex flex={1} />
                      <step.footer {...additionalProps} transitionTo={setStateStepId} />
                    </Flex>
                  </Flex>
                ) : null}
              </Flex>
            </FlowStepper.Indexed.Step>
          ))}
        </FlowStepper.Indexed>
      )}
    </Flex>
  );
};

export default withV3StyleProvider(UpdateModal);
