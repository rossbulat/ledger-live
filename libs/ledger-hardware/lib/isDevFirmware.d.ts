/**
 * In order to mitigate users on odd firmware versions reporting
 * connectivity errors when interacting with the app. Attempt to detect
 * those versions and set a flag for UI.
 */
declare const isDevFirmware: (seVersion: string | undefined) => boolean;
export default isDevFirmware;
//# sourceMappingURL=isDevFirmware.d.ts.map