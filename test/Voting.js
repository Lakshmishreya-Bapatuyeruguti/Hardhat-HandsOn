const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");
describe("checking if organizer matches with deployer", function () {
  async function deployFixture() {
    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();
    return { voting };
  }
  it("Should be organizer Only", async () => {
    const [owner] = await ethers.getSigners();
    const { voting } = await loadFixture(deployFixture);
    let organizer = owner.address;
    expect(await voting.electionOrganizer()).to.equal(organizer);
  });
});

describe("checking if election has started", function () {
  async function deployFixture() {
    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();
    return { voting };
  }
  it("Election has started", async () => {
    const { voting } = await loadFixture(deployFixture);
    await voting.startVoting();
    expect(await voting.electionStarted()).to.equal(true);
  });
});

describe("checking Age of Voter for Eligibility", function () {
  async function deployFixture() {
    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();
    return { voting };
  }
  it("Voter is eligible or", async () => {
    const [, voter1] = await ethers.getSigners();
    const { voting } = await loadFixture(deployFixture);
    expect(
      await voting.addVoter("Sanjay", 20, voter1.address)
    ).to.be.revertedWith("Not eligible to vote");
  });
});

describe("checking if organizer should not be able to vote ", function () {
  async function deployFixture() {
    const [, voter, candidateAdr] = await ethers.getSigners();
    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();
    return { voting, voter, candidateAdr };
  }
  it("Organizer Cannot Vote", async () => {
    const { voting, voter, candidateAdr } = await loadFixture(deployFixture);
    await voting.startVoting();
    expect(
      await voting.connect(voter).voteTo(3, candidateAdr.address)
    ).to.be.revertedWith("Organizer can't vote");
  });
});
describe("checking if election has ended", function () {
  async function deployFixture() {
    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();
    return { voting };
  }
  it("Election has ended", async () => {
    const { voting } = await loadFixture(deployFixture);
    await voting.endVoting();
    expect(await voting.electionEnded()).to.equal(true);
  });
});

describe("checking if Voter has voted previously", function () {
  async function deployFixture() {
    const [, voter1, candidateAdr] = await ethers.getSigners();
    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();
    return { voting, voter1, candidateAdr };
  }
  it("Voter has voted only once", async () => {
    const { voting, voter1, candidateAdr } = await loadFixture(deployFixture);
    await voting.startVoting();
    await voting.connect(voter1).voteTo(3, candidateAdr.address);
    // await voting.connect(voter1).voteTo(3, candidateAdr.address);
    let didVote = await voting.allowed();
    expect(didVote).to.equal(1);
  });
});
