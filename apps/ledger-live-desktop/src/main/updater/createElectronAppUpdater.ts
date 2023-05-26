import crypto from "crypto";
import path from "path";
import fsPromises from "fs/promises";
import fs from "fs";
import { UpdateFetchFileFail } from "@ledgerhq/errors";
import network from "@ledgerhq/live-common/network";
import createAppUpdater from "./createAppUpdater";
import pubKey from "./ledger-pubkey";
import { UpdateDownloadedEvent } from "@ledgerhq/electron-updater";

export default async ({ feedURL, info }: { feedURL: string; info: UpdateDownloadedEvent }) => {
  const { version: updateVersion, path: filename, downloadedFile: filePath } = info;
  const hashFileURL = `${feedURL}/ledger-live-desktop-${updateVersion}.sha512sum`;
  const hashSigFileURL = `${feedURL}/ledger-live-desktop-${updateVersion}.sha512sum.sig`;
  const keysURL = `${feedURL}/pubkeys`;
  return createAppUpdater({
    filename,
    computeHash: () => sha512sumPath(filePath),
    getHashFile: () => getDistantFileContent(hashFileURL),
    getHashFileSignature: () => getDistantFileContent(hashSigFileURL, true),
    getNextKey: (fingerprint?: string | null) =>
      fingerprint
        ? getDistantFileContent(`${keysURL}/${fingerprint}.pem`)
        : Promise.resolve(pubKey),
    getNextKeySignature: async (fingerprint: string) =>
      getDistantFileContent(`${keysURL}/${fingerprint}.pem.sig`, true),
  });
};

// read the electron-updater file. we basically only need the filename here,
// because the hash file contains hashes for all platforms (better to have
// only 1 file to sign lel)
export async function readUpdateInfos(updateFolder: string) {
  const updateInfoPath = path.resolve(updateFolder, "update-info.json");
  const updateInfoContent = await fsPromises.readFile(updateInfoPath, "utf-8");
  return JSON.parse(updateInfoContent);
}

// compute hash for given path.
export function sha512sumPath(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const sum = crypto.createHash("sha512");
    const stream = fs.createReadStream(path);
    stream.on("data", data => sum.update(data));
    stream.on("end", () => resolve(sum.digest("hex")));
    stream.on("error", reject);
  });
}
async function getDistantFileContent(url: string, binary = false) {
  const query: { method: string; url: string; responseType?: string } = {
    method: "GET",
    url,
  };
  if (binary) {
    query.responseType = "arraybuffer";
  }
  try {
    // @ts-expect-error axios versions mismatch, so types mismatch…
    const res = await network(query);
    return res.data;
  } catch (err) {
    throw new UpdateFetchFileFail(url);
  }
}
