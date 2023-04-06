const { task } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

require("./tasks/deploy-contract");
require("./tasks/verify-contract");

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
