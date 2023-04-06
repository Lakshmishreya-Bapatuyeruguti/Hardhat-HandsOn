const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");
describe("Testing Voting Contract", function () {
  async function deployFixture() {
    const [owner, voter1, candidateAdr, voter2, voter3, candidateAdr2] =
      await ethers.getSigners();
    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();
    return {
      voting,
      owner,
      voter1,
      candidateAdr,
      voter2,
      voter3,
      candidateAdr2,
    };
  }
  describe("checking if organizer matches with deployer", function () {
    it("Should be organizer Only", async () => {
      const [owner] = await ethers.getSigners();
      const { voting } = await loadFixture(deployFixture);
      let organizer = owner.address;
      expect(await voting.electionOrganizer()).to.equal(organizer);
    });
  });
  describe("checking if election has started", function () {
    it("Election has started", async () => {
      const { voting } = await loadFixture(deployFixture);
      await voting.startVoting();
      expect(await voting.electionStarted()).to.equal(true);
    });
  });
  describe("checking Age of Voter for Eligibility", function () {
    it("Voter is eligible to vote", async () => {
      const [, voter1] = await ethers.getSigners();
      const { voting } = await loadFixture(deployFixture);
      expect(
        await voting.addVoter("Sanjay", 20, voter1.address)
      ).to.be.revertedWith("Not eligible to vote");
    });

    it("Voter is not eligible to vote as voter has to be 18 or above", async () => {
      const [, voter1] = await ethers.getSigners();
      const { voting } = await loadFixture(deployFixture);
      await expect(
        voting.addVoter("Jayden", 16, voter1.address)
      ).to.be.revertedWith("Not eligible to vote");
    });
  });
  describe("checking if organizer should not be able to vote ", function () {
    it("Organizer Cannot Vote", async () => {
      const { voting, owner, candidateAdr } = await loadFixture(deployFixture);
      await voting.startVoting();
      await expect(
        voting.connect(owner).voteTo(3, candidateAdr.address)
      ).to.be.revertedWith("Organizer can't vote");
    });
  });
  describe("checking if election has ended", function () {
    it("Election has ended", async () => {
      const { voting } = await loadFixture(deployFixture);
      await voting.endVoting();
      expect(await voting.electionEnded()).to.equal(true);
    });
  });

  describe("checking if Voter has voted previously", function () {
    it("Voter has voted only once", async () => {
      const { voting, voter1, candidateAdr } = await loadFixture(deployFixture);
      await voting.startVoting();
      await voting.connect(voter1).voteTo(3, candidateAdr.address);
      let didVote = await voting.allowed();
      expect(didVote).to.equal(1);
    });
    it("Voter has voted more than once", async () => {
      const { voting, voter1, candidateAdr } = await loadFixture(deployFixture);
      await voting.startVoting();
      await voting.connect(voter1).voteTo(3, candidateAdr.address);

      await expect(
        voting.connect(voter1).voteTo(3, candidateAdr.address)
      ).to.be.revertedWith("Already Voted");
    });
  });
  describe("checking if candidate votes are updated ", function () {
    it("Candidate votes is incremented for each vote", async () => {
      const { voting, candidateAdr, voter1 } = await loadFixture(deployFixture);
      let votesTillNow = await voting.getCandidateVotes(candidateAdr.address);
      await voting.startVoting();
      await voting.connect(voter1).voteTo(3, candidateAdr.address);
      expect(await voting.getCandidateVotes(candidateAdr.address)).to.equal(
        votesTillNow.add(1)
      );
    });
  });
  describe("checking if candidate Exists ", function () {
    it("Candidate Exists already", async () => {
      const { voting, candidateAdr } = await loadFixture(deployFixture);
      await voting.setCandidate("Ram", 35, "XYZ", candidateAdr.address);
      await expect(
        voting.setCandidate("Ram", 35, "XYZ", candidateAdr.address)
      ).to.be.revertedWith("Already candidate exists");
    });
    it("Candidate do not exists previously so candidate added", async () => {
      const { voting, candidateAdr } = await loadFixture(deployFixture);
      expect(voting.setCandidate("Ram", 35, "XYZ", candidateAdr.address)).to.not
        .be.reverted;
    });
  });
});
