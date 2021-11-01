import { task } from "hardhat/config";

import { RegistryContract } from "../../types/RegistryContract";
import { RegistryContract__factory } from "../../types/factories/RegistryContract__factory";

task("deploy:RegistryContract").setAction(async function (taskArgs, { ethers }) {
  const registryContractFactory: RegistryContract__factory = await ethers.getContractFactory("RegistryContract");
  const registryContract: RegistryContract = <RegistryContract>await registryContractFactory.deploy();
  await registryContract.deployed();
  console.log("RegistryContract deployed to: ", registryContract.address);
});
