import * as Client from 'fabric-client';
import {join, resolve} from 'path';
import { safeLoad } from 'js-yaml';
import { ensureDir, ensureFile, readdir, readFile } from 'fs-extra';
const client = new Client();
const keyStore = '/Users/vladimirbro/hyperledger-fabric-network/.hfc-org1';
const networkProfilePath = '/Users/vladimirbro/hyperledger-fabric-network/network-profiles/org1.network-profile.yaml';
const enrollmentID = 'testUser3'
let networkProfileContent = null;

const adminUserName = 'admin';
async function enroll () {
  const stateStore = await Client.newDefaultKeyValueStore({
    path: keyStore
  });
  client.setStateStore(stateStore);

  const cryptoSuite = Client.newCryptoSuite();
  const cryptoStore = Client.newCryptoKeyStore({
    path: keyStore
  });

  cryptoSuite.setCryptoKeyStore(cryptoStore);
  client.setCryptoSuite(cryptoSuite);

  // const mspPath = resolve(process.cwd());

  // await ensureDir(mspPath);

  try {
    const profileStr = await readFile(resolve(process.cwd(), networkProfilePath), 'utf8');
    if (/\.json$/.test(networkProfilePath)) {
      networkProfileContent = JSON.parse(profileStr);
    } else {
      networkProfileContent = safeLoad(profileStr);
    }
    // console.log('networkProfileContent:', networkProfileContent);
  } catch (e) {
    throw new Error(
      `Failed to read or parse the network profile at '${networkProfilePath}', ${e.toString()}`
    );
  }

  const { organizations } = networkProfileContent as any;

  await Promise
    .all(Object.keys(organizations)
      .map(async name => {
        const org = organizations[name];

        if (org.adminPrivateKey && org.signedCert) {
          org.adminPrivateKey.path = await getLonelyFile(org.adminPrivateKey.path);
          org.signedCert.path = await getLonelyFile(org.signedCert.path);
        }
      }));

  client.loadFromConfig(networkProfileContent);

  const admin = await client.getUserContext(adminUserName, true);

  const ca = client.getCertificateAuthority();

  const enrollmentSecret = await ca.register({ enrollmentID, affiliation: 'org1'}, admin);

  const { key, certificate } = await ca.enroll({
    enrollmentSecret,
    enrollmentID
  });

  return client.createUser({
    mspid: 'org1MSP',
    skipPersistence: false,
    username: enrollmentID,
    cryptoContent: {
      privateKeyPEM: key.toBytes(),
      signedCertPEM: certificate
    }
  });
}

enroll().then((result) => {
  console.log('result:', result);
}).catch(error => console.log(error));

async function getLonelyFile(folderPath: string): Promise<string> {
  folderPath = resolve(folderPath);

  const isFile = await ensureFile(folderPath)
    .then(() => Promise.resolve(true))
    .catch(() => Promise.resolve(false));

  const isDir = await ensureDir(folderPath)
    .then(() => Promise.resolve(true))
    .catch(() => Promise.resolve(false));

  if (isFile) {
    return folderPath;
  }

  if (!isDir) {
    throw new Error(`Path '${folderPath}' neither a file or a directory`);
  }

  const content = await readdir(folderPath);

  if (content.length !== 1) {
    throw new Error(`Directory '${folderPath}' must contain only one file, but contains ${content.length}`);
  }

  return join(folderPath, content[0]);
}
