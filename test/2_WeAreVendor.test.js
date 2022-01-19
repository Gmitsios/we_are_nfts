const { expect } = require("chai");
const { constants } = require("ethers");
const { ethers } = require("hardhat");
const { AddressZero } = constants;

describe("Vendor Contract", function () {
  const name = "Vendor shop";
  const nickname = "Vinterboss";
  const country = "Greece";
  const city = "North Aegean";
  const address = "117 Paloma Str";
  const vatNum = "ABC1234567";

  beforeEach(async function () {
    const [owner, vendor, other] = await ethers.getSigners();
    this.owner = owner;
    this.vendor = vendor;
    this.other = other;

    const WeAreVendor = await ethers.getContractFactory("WeAreVendor");
    this.vendor = await WeAreVendor.deploy(
      name,
      nickname,
      country,
      city,
      address,
      vatNum
    );
    await this.vendor.deployed();
  });

  describe("details", async function () {
    it("has a name", async function () {
      const instance = this.vendor;

      expect(await instance.getName()).to.equal(name);
    });

    it("has a nickname", async function () {
      const instance = this.vendor;

      expect(await instance.getNickname()).to.equal(nickname);
    });

    it("is not an old man", async function () {
      const instance = this.vendor;

      expect(await instance.getCountry()).to.equal(country);
    });

    it("has a city", async function () {
      const instance = this.vendor;

      expect(await instance.getCity()).to.equal(city);
    });

    it("has an address", async function () {
      const instance = this.vendor;

      expect(await instance.getAddress()).to.equal(address);
    });

    it("has a vat number", async function () {
      const instance = this.vendor;

      expect(await instance.getVatNumber()).to.equal(vatNum);
    });
  });

  describe("role", async function () {
    it("can be assigned", async function () {
      const instance = this.vendor;

      await instance.assign(this.vendor.address);
      expect(await instance.getVendorAddress()).to.equal(this.vendor.address);
    });

    it("only owner can assign", async function () {
      const instance = this.vendor;

      await expect(
        instance.connect(this.other).assign(this.vendor.address)
      ).to.be.revertedWith("AccessControl");
    });

    it("receiver address is not null", async function () {
      const instance = this.vendor;

      await expect(instance.assign(AddressZero)).to.be.revertedWith(
        "Zero address input detected!"
      );
    });

    it("is only assigned once", async function () {
      const instance = this.vendor;

      await instance.assign(this.vendor.address);
      await expect(instance.assign(this.other.address)).to.be.revertedWith(
        "Vendor already assigned!"
      );
    });
  });

  describe("activation", async function () {
    it("is inactive by default", async function () {
      const instance = this.vendor;

      expect(await instance.isActive()).to.equal(false);
    });

    context("can be activated", async function () {
      it("by owner", async function () {
        const instance = this.vendor;

        await instance.activate();
        expect(await instance.isActive()).to.equal(true);
      });

      it("not by others", async function () {
        const instance = this.vendor;

        await expect(
          instance.connect(this.other).activate()
        ).to.be.revertedWith("AccessControl");
      });
    });

    context("can be deactivated", async function () {
      it("by owner", async function () {
        const instance = this.vendor;

        await instance.activate();
        await instance.deactivate();
        expect(await instance.isActive()).to.equal(false);
      });

      it("not by others", async function () {
        const instance = this.vendor;

        await instance.activate();
        await expect(
          instance.connect(this.other).deactivate()
        ).to.be.revertedWith("AccessControl");
      });

      it("only when activated first", async function () {
        const instance = this.vendor;

        await expect(instance.deactivate()).to.be.revertedWith(
          "Vendor is inactive!"
        );
      });
    });
  });
});
