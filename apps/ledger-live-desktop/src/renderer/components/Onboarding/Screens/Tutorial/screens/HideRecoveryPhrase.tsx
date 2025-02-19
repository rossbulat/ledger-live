import React from "react";
import { useTranslation, Trans } from "react-i18next";
import {
  Title,
  SubTitle,
  Bullet,
  Column,
  Row,
  IllustrationContainer,
  AsideFooter,
} from "../shared";
import { Button, Icons } from "@ledgerhq/react-ui";
import hideRecoverySheet from "../assets/hideRecoverySheet.png";
type Props = {
  handleHelp: () => void;
};

export function HideRecoveryPhrase({ handleHelp }: Props) {
  const { t } = useTranslation();

  return (
    <Column>
      <Title>{t("onboarding.screens.tutorial.screens.hideRecoveryPhrase.title")}</Title>
      <SubTitle mb={8}>
        {t("onboarding.screens.tutorial.screens.hideRecoveryPhrase.paragraph")}
      </SubTitle>
      <Bullet
        icon="NanoFolded"
        text={t("onboarding.screens.tutorial.screens.hideRecoveryPhrase.keepItOffline")}
      />
      <Bullet
        icon="EyeNone"
        text={t("onboarding.screens.tutorial.screens.hideRecoveryPhrase.neverShowToAnyone")}
      />
      <Row>
        <Button onClick={handleHelp} Icon={Icons.HelpMedium} iconSize={18} iconPosition="right">
          {t("onboarding.screens.tutorial.screens.hideRecoveryPhrase.buttons.learn")}
        </Button>
      </Row>
    </Column>
  );
}

HideRecoveryPhrase.Illustration = (
  <IllustrationContainer width="240px" height="245px" src={hideRecoverySheet} />
);

const Footer = (props: object) => {
  const { t } = useTranslation();
  return (
    <AsideFooter
      {...props}
      text={t("onboarding.screens.tutorial.screens.hideRecoveryPhrase.help.descr")}
    />
  );
};

HideRecoveryPhrase.Footer = Footer;

HideRecoveryPhrase.continueLabel = (
  <Trans i18nKey="onboarding.screens.tutorial.screens.hideRecoveryPhrase.buttons.next" />
);
