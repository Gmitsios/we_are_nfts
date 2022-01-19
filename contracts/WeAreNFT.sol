pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WeAreNFT is ERC721URIStorage, AccessControl {
  bytes32 public constant VENDOR_ROLE = keccak256("VENDOR_ROLE");
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  using Counters for Counters.Counter;
  Counters.Counter internal _tokenIds;
  uint256 private _supply;
  uint256 private _price;
  bool private _priceChangeRequested = false;
  uint256 private _requestedPrice;

  constructor(string memory name_, string memory symbol_, uint256 supply_, uint256 price_) ERC721(name_, symbol_) ERC721URIStorage() {
    // Grant the contract deployer the default admin role: it will be able
    // to grant and revoke any roles
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(MINTER_ROLE, msg.sender);

    _supply = supply_;
    _price = price_;
  }

  function getSupply() external view returns (uint256) {
    return _supply;
  }

  function getLastMinted() external view virtual returns (uint256) {
    return _tokenIds.current();
  }

  function getPrice() public view returns (uint256) {
    return _price;
  }

  function requestPriceChange(uint256 newPrice) external onlyRole(VENDOR_ROLE) {
    _priceChangeRequested = true;
    _requestedPrice = newPrice;
  }

  function approvePriceChange() external onlyRole(DEFAULT_ADMIN_ROLE) {
    changePrice(_requestedPrice);
    _priceChangeRequested = false;
  }

  function changePrice(uint256 newPrice) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _price = newPrice;
  }

  function mint(address player_, string memory tokenURI_) public virtual onlyRole(MINTER_ROLE) returns (uint256) {
    require(_supply == 0 || _tokenIds.current() < _supply, "All tokens have been minted!");
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(player_, newItemId);
    _setTokenURI(newItemId, tokenURI_);

    return newItemId;
  }

  function setVendor(address vendorAddress_) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _setupRole(MINTER_ROLE, vendorAddress_);
    _setupRole(VENDOR_ROLE, vendorAddress_);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
      return super.supportsInterface(interfaceId);
  }
}
