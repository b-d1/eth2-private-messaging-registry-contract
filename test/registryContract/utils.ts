import { init, SecretKey } from "@chainsafe/bls";
import { ZkIdentity } from "@libsem/identity";
import * as bigintConversion from "bigint-conversion";

export interface RegistrationCredentials {
  idCommitment: Uint8Array;
  pubKey: Uint8Array;
  signature: Uint8Array;
}

export const getValidRegistrationCredentials = async (): Promise<RegistrationCredentials> => {
  await init("herumi");

  // BLS secret and public key
  const secretKey = SecretKey.fromKeygen();
  const publicKey = secretKey.toPublicKey();

  // Identity commitment
  const idCommitment = createIdCommitment();

  // Identity commitment signature
  const signature = secretKey.sign(idCommitment);

  console.log("Is signature valid:", signature.verify(publicKey, idCommitment));

  const registrationCredentials: RegistrationCredentials = {
    signature: signature.toBytes(),
    pubKey: publicKey.toBytes(),
    idCommitment: idCommitment,
  };

  return registrationCredentials;
};

const createIdCommitment = (): Uint8Array => {
  const zkIdentity: ZkIdentity = new ZkIdentity();
  zkIdentity.genRandomSecret(1);
  const idCommitment: bigint = zkIdentity.genIdentityCommitmentFromSecret();
  const idCommitmentBuffer = bigintConversion.bigintToBuf(idCommitment);
  return new Uint8Array(idCommitmentBuffer);
};
