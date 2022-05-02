const { expect, assert, use } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, waffle } = require("hardhat");
const provider = waffle.provider;

describe("CrowdfundingEscrow", function () {
  let contract;

  beforeEach(async () => {
    const CrowdfundingEscrow = await ethers.getContractFactory(
      "CrowdfundingEscrow"
    );
    contract = await CrowdfundingEscrow.deploy(
      "cool title",
      "desc here",
      1651727028,
      10000
    );
  });

  describe("constructor arguments correctly passed", () => {
    it("title is assigned a value", async () => {
      await contract.deployed();
      const title = await contract.title();
      assert.isDefined(title, "title is defined");
      assert.isNotEmpty(title, "title is not empty");
      assert.isNotNull(title, "title is not null");
      assert.isString(title, "title is a string");
    });

    it("description is assigned a value", async () => {
      await contract.deployed();
      const description = await contract.description();
      assert.isDefined(description, "description is defined");
      assert.isNotEmpty(description, "description is not empty");
      assert.isNotNull(description, "description is not null");
      assert.isString(description, "description is a string");
    });

    it("goalAmount must be greater than 0", async () => {
      await contract.deployed();
      const goalAmount = await contract.goalAmount();

      assert.isAbove(goalAmount, 0, "goalAmount is greater than 0");
    });

    it("endDate should be greater than current time", async () => {
      await contract.deployed();
      const endDate = await contract.endDate();
      let currentTimeInSeconds = (Date.now() / 1000).toFixed(0);

      assert.isAtLeast(
        endDate,
        currentTimeInSeconds,
        "endDate is greater than current time"
      );
    });
  });

  describe("commitFunds()", () => {
    it("smart contract balance should INCREASE", async () => {
      await contract.deployed();
      const initialBalance = await provider.getBalance(contract.address);
      const value = 10;
      await contract.commitFunds({ value: value });
      const finalBalance = await provider.getBalance(contract.address);

      assert.isAbove(finalBalance, initialBalance);
    });
  });

  describe("cancelCommitment()", () => {
    it("smart contract balance should DECREASE", async () => {
      await contract.deployed();
      await contract.commitFunds({ value: 10 });

      const initialBalance = await provider.getBalance(contract.address);
      const value = 5;
      const cancelCommitment = await contract.cancelCommitment(value);
      const finalBalance = await provider.getBalance(contract.address);
      assert.isBelow(finalBalance, initialBalance);
    });
  });

  describe("closeEscrow()", () => {
    it("current time must be greater than endDate", async () => {
      await contract.deployed();

      assert.isAbove(balance, 0);
    });

    it("contract funds transfer over to creator", async () => {
      await contract.deployed();
      await contract.commitFunds({ value: 10 });

      const balance = await provider.getBalance(contract.address);
      assert.isAbove(balance, 0);
    });
  });
});
