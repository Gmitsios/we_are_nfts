pragma solidity ^0.8.0;

import "./WeAreNFT.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WeAreVendor is AccessControl {
  bytes32 public constant VENDOR_ROLE = keccak256("IS_WE_ARE_VENDOR");

  string private _vendorName;
  string private _vendorNickname;
  string private _vendorCountry;
  string private _vendorCity;
  string private _vendorAddress;
  string private _vendorVatNumber;
  address private _address;
  bool private _active = false;

  using Counters for Counters.Counter;
  Counters.Counter private _nftIds;
  WeAreNFT[] private _NFTs;
  mapping(string => uint256) private _NFTmappings;

  constructor(
    string memory name_,
    string memory nickname_,
    string memory country_,
    string memory city_,
    string memory address_,
    string memory vatNumber_
    ) {
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

      _vendorName = name_;
      _vendorNickname = nickname_;
      _vendorCountry = country_;
      _vendorCity = city_;
      _vendorAddress = address_;
      _vendorVatNumber = vatNumber_;
  }

  // function createNFT(string memory name, string memory symbol, uint supply, uint price) public activated onlyRole(VENDOR_ROLE) {
  //   require(bytes(name).length != 0, "NFT name is empty!");
  //   require(bytes(symbol).length != 0, "NFT symbol is empty!");
  //   require(_NFTmappings[symbol] == 0, "NFT exists!");

  //   _nftIds.increment();
  //   _NFTmappings[symbol] = _nftIds.current();
  //   _NFTs.push(new WeAreNFT(name, symbol, supply, price));
  // }

  // function getNFT(string memory symbol) public view returns(address) {
  //   require(_NFTmappings[symbol] != 0, "NFT does not exist!");

  //   return address(_NFTs[_NFTmappings[symbol]]);
  // }

  function assign(address vendorAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(vendorAddress != address(0), "Zero address input detected!");
    require(_address == address(0), "Vendor already assigned!");

    _address = vendorAddress;
    _setupRole(VENDOR_ROLE, _address);
  }

  function getVendorAddress() external view returns (address) {
    return _address;
  }

  function activate() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _active = true;
  }

  function deactivate() external activated onlyRole(DEFAULT_ADMIN_ROLE) {
    _active = false;
  }

  function isActive() external view returns (bool) {
    return _active;
  }

  function getName() external view returns (string memory) {
    return _vendorName;
  }

  function getNickname() external view returns (string memory) {
    return _vendorNickname;
  }

  function getCountry() external view returns (string memory) {
    return _vendorCountry;
  }

  function getCity() external view returns (string memory) {
    return _vendorCity;
  }

  function getAddress() external view returns (string memory) {
    return _vendorAddress;
  }

  function getVatNumber() external view returns (string memory) {
    return _vendorVatNumber;
  }

  modifier activated() {
    require(_active, "Vendor is inactive!");
    _;
  }
}
