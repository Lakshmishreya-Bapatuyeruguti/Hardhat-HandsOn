const { task } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");

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
