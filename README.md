# We Are NFTs

Personal NFT project built with hardhat.
100% statement test coverage


Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

## Project specs as generated by tests

```
  WeAreNFT Contract
    details
      ✓ has a name
      ✓ has a symbol
      ✓ can set a vendor
    price
      ✓ has one
      ✓ owner can modify
      ✓ others can't (38ms)
      change request
        ✓ by vendor
        ✓ not by others
    minting
      ✓ owner can mint
      ✓ vendor can mint
      ✓ others can't mint
      after minting
        ✓ has a tokenURI
    supply
      with a set supply
        ✓ has a set supply
        ✓ tokens minted can't surpass supply
      with infinite supply
        ✓ total supply is 0
        ✓ unlimited tokens can be minted

  Vendor Contract
    details
      ✓ has a name
      ✓ has a nickname
      ✓ is not an old man
      ✓ has a city
      ✓ has an address
      ✓ has a vat number
    role
      ✓ can be assigned
      ✓ only owner can assign
      ✓ receiver address is not null
      ✓ is only assigned once
    activation
      ✓ is inactive by default
      can be activated
        ✓ by owner
        ✓ not by others
      can be deactivated
        ✓ by owner
        ✓ not by others
        ✓ only when activated first

  WeAreManager Contract
    vendors
      ✓ owner can create a vendor
      ✓ owner can create multiple vendors
      ✓ no-one else can create vendors
      ✓ can't be duplicates
      ✓ vendor details can't be empty
      with existing vendor
        ✓ owner can assign vendor
        ✓ vendor should be set up already
        ✓ vendor can't be empty
        ✓ zero address can't be assigned
        ✓ others can't assign vendors
```
