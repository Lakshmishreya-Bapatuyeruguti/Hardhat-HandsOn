const { task } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");

// TASK TO DEPLOY
task("deploy-contract", "It deploys our contract").setAction(async () => {
  await hre.run("compile");
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  console.log("deployed at :", voting.address);
});
