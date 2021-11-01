import { expect } from "chai";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { RegistryContract } from "../../types/RegistryContract";
import { Signers } from "../types";

import { getValidRegistrationCredentials, RegistrationCredentials } from "./utils";

describe("Unit tests", function () {
  let registryContract: RegistryContract;

  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("RegistryContract", function () {
    beforeEach(async function () {
      const registryContractArtifact: Artifact = await artifacts.readArtifact("RegistryContract");
      registryContract = <RegistryContract>(
        await waffle.deployContract(this.signers.admin, registryContractArtifact, [])
      );
    });

    it("should emit RegistrationEvent when the registration arguments are correct", async function () {
      const registrationCredentials: RegistrationCredentials = await getValidRegistrationCredentials();

      await expect(
        registryContract
          .connect(this.signers.admin)
          .register(
            registrationCredentials.pubKey,
            registrationCredentials.idCommitment,
            registrationCredentials.signature,
          ),
      )
        .to.emit(registryContract, "RegistrationEvent")
        .withArgs(
          ethers.utils.hexlify(registrationCredentials.pubKey),
          ethers.utils.hexlify(registrationCredentials.idCommitment),
          ethers.utils.hexlify(registrationCredentials.signature),
        );
    });

    it("should revert if the pubkey length is incorrect", async function () {
      const registrationCredentials: RegistrationCredentials = await getValidRegistrationCredentials();

      await expect(
        registryContract
          .connect(this.signers.admin)
          .register(new Uint8Array(30), registrationCredentials.idCommitment, registrationCredentials.signature),
      ).to.be.revertedWith("RegistryContract: invalid pubkey length");
    });

    it("should revert if the idCommitment length is incorrect", async function () {
      const registrationCredentials: RegistrationCredentials = await getValidRegistrationCredentials();

      await expect(
        registryContract
          .connect(this.signers.admin)
          .register(registrationCredentials.pubKey, new Uint8Array(30), registrationCredentials.signature),
      ).to.be.revertedWith("RegistryContract: invalid idCommitment length");
    });

    it("should revert if the signature length is incorrect", async function () {
      const registrationCredentials: RegistrationCredentials = await getValidRegistrationCredentials();

      await expect(
        registryContract
          .connect(this.signers.admin)
          .register(registrationCredentials.pubKey, registrationCredentials.idCommitment, new Uint8Array(30)),
      ).to.be.revertedWith("RegistryContract: invalid signature length");
    });
  });
});
