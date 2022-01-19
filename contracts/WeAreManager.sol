pragma solidity ^0.8.0;

import "./WeAreVendor.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract WeAreManager is AccessControl {
  WeAreVendor[] private _vendors;
  mapping(string => WeAreVendor) private _vendorsMapping;

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  function createVendor(
    string memory name,
    string memory nickname,
    string memory country,
    string memory city,
    string memory vendorAddress,
    string memory vatNumber
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(
      bytes(name).length != 0 &&
      bytes(nickname).length != 0 &&
      bytes(country).length != 0 &&
      bytes(city).length != 0 &&
      bytes(vendorAddress).length != 0,
      "Check Vendor details!"
    );
    require(address(_vendorsMapping[nickname]) == address(0), "Vendor already exists!");

    _vendors.push(new WeAreVendor(
      name, nickname, country, city, vendorAddress, vatNumber
    ));
    _vendorsMapping[nickname] = _vendors[_vendors.length - 1];
  }

  function assignVendor(string memory nickname, address assignAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(bytes(nickname).length != 0, "Provide a valid Vendor nickname!");
    require(address(_vendorsMapping[nickname]) != address(0), "Vendor does not exist!");
    require(assignAddress != address(0), "Can't assign to the zero address!");
    
    _vendorsMapping[nickname].assign(assignAddress);
  }

  function numVendors() external view returns(uint256) {
    return _vendors.length;
  }

  function getVendorAddress(string memory vendorNickname) external view returns(address) {
    return address(_vendorsMapping[vendorNickname]);
  }
}
