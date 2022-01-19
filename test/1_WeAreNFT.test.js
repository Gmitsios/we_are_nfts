const { expect } = require("chai");
const { ethers } = require("hardhat");
const TEST_TOKEN_URI = "https://random.token.uri/";

describe("WeAreNFT Contract", function () {
  const name = "WeAreNFT";
  const symbol = "WRN";
  const price = 0;
  let supply = 2;

  describe("details", async function () {
    beforeEach(async function () {
      const [owner, vendor, other] = await ethers.getSigners();
      this.owner = owner;
      this.vendor = vendor;
      this.other = other;

      const WeAreNFT = await ethers.getContractFactory("WeAreNFT");
      this.weAreNFT = await WeAreNFT.deploy(name, symbol, supply, price);
      await this.weAreNFT.deployed();
    });

    it("has a name", async function () {
      const instance = this.weAreNFT;

      expect(await instance.name()).to.equal(name);
    });

    it("has a symbol", async function () {
      const instance = this.weAreNFT;

      expect(await instance.symbol()).to.equal(symbol);
    });

    it("can set a vendor", async function () {
      const instance = this.weAreNFT;

      await instance.setVendor(this.vendor.address);
    });
  });

  describe("price", async function () {
    beforeEach(async function () {
      const [owner, vendor, other] = await ethers.getSigners();
      this.owner = owner;
      this.vendor = vendor;
      this.other = other;

      const WeAreNFT = await ethers.getContractFactory("WeAreNFT");
      this.weAreNFT = await WeAreNFT.deploy(name, symbol, supply, price);
      await this.weAreNFT.deployed();
    });

    it("has one", async function () {
      const instance = this.weAreNFT;

      expect(await instance.getPrice()).to.equal(0);
    });

    it("owner can modify", async function () {
      const instance = this.weAreNFT;

      await instance.changePrice(100);
      expect(await instance.getPrice()).to.equal(100);
    });

    it("others can't", async function () {
      const instance = this.weAreNFT;

      await expect(
        instance.connect(this.other).changePrice(100)
      ).to.be.revertedWith("AccessControl");
    });

    describe("change request", async function () {
      it("by vendor", async function () {
        const instance = this.weAreNFT;
        await instance.setVendor(this.vendor.address);

        await instance.connect(this.vendor).requestPriceChange(101);
        await instance.approvePriceChange();
        expect(await instance.getPrice()).to.equal(101);
      });

      it("not by others", async function () {
        const instance = this.weAreNFT;

        await expect(
          instance.connect(this.other).requestPriceChange(100)
        ).to.be.revertedWith("AccessControl");
      });
    });
  });

  describe("minting", async function () {
    beforeEach(async function () {
      const [owner, vendor, other] = await ethers.getSigners();
      this.owner = owner;
      this.vendor = vendor;
      this.other = other;

      const WeAreNFT = await ethers.getContractFactory("WeAreNFT");
      this.weAreNFT = await WeAreNFT.deploy(name, symbol, supply, price);
      await this.weAreNFT.deployed();
    });

    it("owner can mint", async function () {
      const instance = this.weAreNFT;

      await instance.mint(this.owner.address, TEST_TOKEN_URI);
      expect(await instance.getLastMinted()).to.equal(1);
    });

    it("vendor can mint", async function () {
      const instance = this.weAreNFT;

      await instance.setVendor(this.vendor.address);
      await instance
        .connect(this.vendor)
        .mint(this.vendor.address, TEST_TOKEN_URI);
      expect(await instance.getLastMinted()).to.equal(1);
    });

    it("others can't mint", async function () {
      const instance = this.weAreNFT;

      await expect(
        instance.connect(this.other).mint(this.other.address, TEST_TOKEN_URI)
      ).to.be.revertedWith("AccessControl");
      expect(await instance.getLastMinted()).to.equal(0);
    });

    context("after minting", async function () {
      it("has a tokenURI", async function () {
        const instance = this.weAreNFT;
        await instance.mint(this.owner.address, TEST_TOKEN_URI);
        const tokenId = await instance.getLastMinted();

        expect(await instance.tokenURI(tokenId)).to.be.equal(TEST_TOKEN_URI);
      });
    });
  });

  describe("supply", async function () {
    context("with a set supply", async function () {
      beforeEach(async function () {
        const [owner, vendor, other] = await ethers.getSigners();
        this.owner = owner;
        this.vendor = vendor;
        this.other = other;

        const WeAreNFT = await ethers.getContractFactory("WeAreNFT");
        this.weAreNFT = await WeAreNFT.deploy(name, symbol, supply, price);
        await this.weAreNFT.deployed();
      });

      it("has a set supply", async function () {
        const instance = this.weAreNFT;

        expect(await instance.getSupply()).to.equal(supply);
      });

      it("tokens minted can't surpass supply", async function () {
        const instance = this.weAreNFT;

        await instance.mint(this.owner.address, TEST_TOKEN_URI);
        await instance.mint(this.owner.address, TEST_TOKEN_URI);
        await expect(
          instance.mint(this.owner.address, TEST_TOKEN_URI)
        ).to.be.revertedWith("All tokens have been minted!");
      });
    });

    context("with infinite supply", async function () {
      beforeEach(async function () {
        supply = 0;
        const [owner, vendor, other] = await ethers.getSigners();
        this.owner = owner;
        this.vendor = vendor;
        this.other = other;

        const WeAreNFT = await ethers.getContractFactory("WeAreNFT");
        this.weAreNFT = await WeAreNFT.deploy(name, symbol, 0, price);
        await this.weAreNFT.deployed();
      });

      it("total supply is 0", async function () {
        const instance = this.weAreNFT;

        expect(await instance.getSupply()).to.equal(0);
      });

      it("unlimited tokens can be minted", async function () {
        const instance = this.weAreNFT;

        await instance.mint(this.owner.address, TEST_TOKEN_URI);
        await instance.mint(this.owner.address, TEST_TOKEN_URI);
        await instance.mint(this.owner.address, TEST_TOKEN_URI);
        expect(await instance.getLastMinted()).to.equal(3);
      });
    });
  });
});
