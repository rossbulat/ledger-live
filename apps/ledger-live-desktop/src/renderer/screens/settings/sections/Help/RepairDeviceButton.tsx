import React, { PureComponent } from "react";
import { compose } from "redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import repairFirmwareUpdate from "@ledgerhq/live-common/hw/firmwareUpdate-repair";
import { withTranslation, TFunction } from "react-i18next";
import logger from "~/renderer/logger";
import Button, { Props as ButtonProps } from "~/renderer/components/Button";
import RepairModal from "~/renderer/modals/RepairModal";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";

type OwnProps = {
  buttonProps?: ButtonProps;
  onRepair?: (a: boolean) => void;
};
type Props = OwnProps & {
  t: TFunction;
  history: RouteComponentProps["history"];
};
type State = {
  opened: boolean;
  isLoading: boolean;
  error: Error | undefined | null;
  progress: number;
};
class RepairDeviceButton extends PureComponent<Props, State> {
  state = {
    opened: false,
    isLoading: false,
    error: null,
    progress: 0,
  };

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.sub) this.sub.unsubscribe();
  }

  open = () =>
    this.setState({
      opened: true,
      error: null,
    });

  sub: any;
  timeout: NodeJS.Timeout | undefined;
  close = () => {
    const { onRepair } = this.props;
    if (this.sub) this.sub.unsubscribe();
    if (this.timeout) clearTimeout(this.timeout);
    if (onRepair) {
      onRepair(false);
    }
    this.setState({
      opened: false,
      isLoading: false,
      error: null,
      progress: 0,
    });
  };

  repair = (version?: string | null) => {
    if (this.state.isLoading) return;
    const { history, onRepair } = this.props;
    if (onRepair) {
      onRepair(true);
    }
    this.timeout = setTimeout(
      () =>
        this.setState({
          isLoading: true,
        }),
      500,
    );
    this.sub = repairFirmwareUpdate("", version).subscribe({
      next: patch => {
        this.setState(patch);
      },
      error: (error: Error) => {
        logger.critical(error);
        if (this.timeout) clearTimeout(this.timeout);
        this.setState({
          error,
          isLoading: false,
          progress: 0,
        });
      },
      complete: () => {
        if (this.timeout) clearTimeout(this.timeout);
        this.setState(
          {
            opened: false,
            isLoading: false,
            progress: 0,
          },
          () => {
            setTrackingSource("settings help repair device");
            history.push({
              pathname: "/manager",
            });
          },
        );
        if (onRepair) {
          onRepair(false);
        }
      },
    });
  };

  render() {
    const { t, buttonProps } = this.props;
    const { opened, isLoading, error, progress } = this.state;
    return (
      <>
        <Button {...buttonProps} primary onClick={this.open} event="RepairDeviceButton">
          {t("settings.repairDevice.button")}
        </Button>

        <RepairModal
          cancellable
          analyticsName="RepairDevice"
          isOpened={opened}
          onReject={this.close}
          repair={this.repair}
          isLoading={isLoading}
          title={t("settings.repairDevice.title")}
          desc={t("settings.repairDevice.desc")}
          progress={progress}
          error={error}
          enableSomethingElseChoice={false}
        />
      </>
    );
  }
}
const RepairDeviceButtonOut = compose<React.ComponentType<OwnProps>>(
  withTranslation(),
  withRouter,
)(RepairDeviceButton);
export default RepairDeviceButtonOut;
