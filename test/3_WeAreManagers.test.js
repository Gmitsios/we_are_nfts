const { expect } = require("chai");
const { constants } = require("ethers");
const { ethers } = require("hardhat");
const { AddressZero } = constants;

describe("WeAreManager Contract", function () {
  beforeEach(async function () {
    const [owner, vendor, other] = await ethers.getSigners();
    this.owner = owner;
    this.vendor = vendor;
    this.other = other;

    const WeAreManager = await ethers.getContractFactory("WeAreManager");
    this.weAreManager = await WeAreManager.deploy();
    await this.weAreManager.deployed();
  });

  describe("vendors", async function () {
    it("owner can create a vendor", async function () {
      const instance = this.weAreManager;

      await instance.createVendor(
        "Vendor Name 1",
        "Vendor Nickname 1",
        "Vendor Country 1",
        "Vendor City 1",
        "Vendor Address 1",
        "Vendor Vatnumber 1"
      );
      expect(await instance.numVendors()).to.equal(1);
    });

    it("owner can create multiple vendors", async function () {
      const instance = this.weAreManager;

      await instance.createVendor(
        "Vendor Name 1",
        "Vendor Nickname 1",
        "Vendor Country 1",
        "Vendor City 1",
        "Vendor Address 1",
        "Vendor Vatnumber 1"
      );
      await instance.createVendor(
        "Vendor Name 2",
        "Vendor Nickname 2",
        "Vendor Country 2",
        "Vendor City 2",
        "Vendor Address 2",
        "Vendor Vatnumber 2"
      );
      expect(await instance.numVendors()).to.equal(2);
    });

    it("no-one else can create vendors", async function () {
      const instance = this.weAreManager;

      await expect(
        instance
          .connect(this.other)
          .createVendor(
            "Vendor Name 1",
            "Vendor Nickname 1",
            "Vendor Country 1",
            "Vendor City 1",
            "Vendor Address 1",
            "Vendor Vatnumber 1"
          )
      ).to.be.revertedWith("AccessControl");
      expect(await instance.numVendors()).to.equal(0);
    });

    it("can't be duplicates", async function () {
      const instance = this.weAreManager;
      const duplicateNickanme = "Nickname Dup";

      await instance.createVendor(
        "Vendor Name 1",
        duplicateNickanme,
        "Vendor Country 1",
        "Vendor City 1",
        "Vendor Address 1",
        "Vendor Vatnumber 1"
      );
      await expect(
        instance.createVendor(
          "Vendor Name 2",
          duplicateNickanme,
          "Vendor Country 2",
          "Vendor City 2",
          "Vendor Address 2",
          "Vendor Vatnumber 2"
        )
      ).to.be.revertedWith("Vendor already exists!");
      expect(await instance.numVendors()).to.equal(1);
    });

    it("vendor details can't be empty", async function () {
      const instance = this.weAreManager;

      await expect(
        instance.createVendor(
          "",
          "Vendor Nickname 1",
          "Vendor Country 1",
          "Vendor City 1",
          "Vendor Address 1",
          "Vendor Vatnumber 1"
        )
      ).to.be.revertedWith("Check Vendor details!");
      expect(await instance.numVendors()).to.equal(0);
    });

    context("with existing vendor", async function () {
      beforeEach(async function () {
        const WeAreVendor = await ethers.getContractFactory("WeAreVendor");
        this.nickname = "Test Vendor Nickname";

        await this.weAreManager.createVendor(
          "Vendor Name 1",
          this.nickname,
          "Vendor Country 1",
          "Vendor City 1",
          "Vendor Address 1",
          "Vendor Vatnumber 1"
        );
        this.vendorInstance = WeAreVendor.attach(
          this.weAreManager.getVendorAddress(this.nickname)
        );
      });

      it("owner can assign vendor", async function () {
        const instance = this.weAreManager;
        const vendor = this.vendorInstance;

        await instance.assignVendor(this.nickname, this.vendor.address);
        expect(await vendor.getVendorAddress()).to.equal(this.vendor.address);
      });

      it("vendor should be set up already", async function () {
        const instance = this.weAreManager;

        await expect(
          instance.assignVendor("Not Existing Vendor", this.vendor.address)
        ).to.be.revertedWith("Vendor does not exist!");
      });

      it("vendor can't be empty", async function () {
        const instance = this.weAreManager;

        await expect(
          instance.assignVendor("", this.vendor.address)
        ).to.be.revertedWith("Provide a valid Vendor nickname!");
      });

      it("zero address can't be assigned", async function () {
        const instance = this.weAreManager;

        await expect(
          instance.assignVendor(this.nickname, AddressZero)
        ).to.be.revertedWith("Can't assign to the zero address!");
      });

      it("others can't assign vendors", async function () {
        const instance = this.weAreManager;

        await expect(
          instance
            .connect(this.other)
            .assignVendor(this.nickname, this.vendor.address)
        ).to.be.revertedWith("AccessControl");
      });
    });
  });
});
