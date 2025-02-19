import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Toast } from "./Toast";
import { useToasts } from "@ledgerhq/live-common/notifications/ToastProvider/index";
import { v4 as uuidv4 } from "uuid";
import { openInformationCenter } from "~/renderer/actions/UI";
const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 18px;
  & *:nth-child(n + 6) {
    display: none;
  }
`;
export function ToastOverlay() {
  const { toasts, dismissToast } = useToasts();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const onOpenInformationCenter = useCallback(
    () => dispatch(openInformationCenter("announcement")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return (
    <Wrapper>
      {toasts.length < 2 ? (
        toasts.map(({ id, type, title, text, icon, callback }) => (
          <Toast
            key={id}
            id={id}
            type={type}
            title={title}
            icon={icon}
            text={text}
            callback={callback}
            onDismiss={dismissToast}
          />
        ))
      ) : (
        <Toast
          id={uuidv4()}
          icon="info"
          title={t("toastOverlay.groupedToast.text", {
            count: toasts.length,
          })}
          cta={t("toastOverlay.groupedToast.cta")}
          onDismiss={dismissToast}
          dismissable={false}
          callback={onOpenInformationCenter}
        />
      )}
    </Wrapper>
  );
}
