const { task } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

// TASK TO DEPLOY
task("deploy-contract", "It deploys our contract").setAction(async () => {
  await hre.run("compile");
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  console.log("deployed at :", voting.address);
});
// TASK TO VERIFY
task("verify-contract", "This makes the source code public")
  .addParam("address", "Address of deployed Contract")
  .setAction(async (taskArgs) => {
    await hre.run("verify:verify", {
      address: taskArgs.address,
      contract: "contracts/Voting.sol:Voting",
      libraries: "",
    });
  });

module.exports = {
  solidity: "0.8.18",
  networks: {
    polygon_mumbai: {
      url: `${process.env.ALCHEMY_API_KEY}`,
      accounts: [`${process.env.WALLET_ADR_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: `${process.env.POLYGON_MUMBAI_API_KEY}`,
  },
};
