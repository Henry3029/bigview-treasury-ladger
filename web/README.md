# 🌊 Bigview Treasury (Base Sepolia)

**Bigview** is a decentralized treasury and governance protocol migrated to the **Base** ecosystem. It enables community-driven fund management, ETH staking, and BVW token distribution through high-performance Solidity smart contracts.

---

## 🛠️ Tech Stack & Architecture

* **Network:** Base Sepolia (Testnet)
* **Smart Contracts:** Solidity (EVM)
* **Frontend:** Next.js 14, Tailwind CSS, Lucide Icons
* **Web3 Integration:** Privy (Auth), Wagmi, & Viem
* **Development Framework:** Foundry (Rust-based)

---

## 🏗️ Project Structure

* `/src`: Frontend Next.js application.
* `/contracts`: Solidity source files for `BigViewToken.sol` and `BigViewTreasury.sol`.
* `/test`: Comprehensive Foundry test suites.
* `/script`: Deployment and maintenance scripts.

---

## ⚡ Foundry Toolkit

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

### Documentation
Full Foundry documentation can be found here: [https://book.getfoundry.sh/](https://book.getfoundry.sh/)

---

## 🚀 Usage

### Build
Compile the smart contracts:
```shell
$ forge build
```

### Test
Run the Bigview test suite (Unit & Integration):
```shell
$ forge test
```

### Format
Ensure Solidity code follows style guidelines:
```shell
$ forge fmt
```

### Gas Snapshots
Analyze gas efficiency for staking and reward claims:
```shell
$ forge snapshot
```

### Local Node (Anvil)
Spin up a local Base-forked environment:
```shell
$ anvil
```

### Deploy to Base Sepolia
```shell
$ forge script script/DeployBigview.s.sol:DeployScript --rpc-url $BASE_SEPOLIA_RPC --private-key $PRIVATE_KEY --broadcast --verify
```

### Cast
Interact with the treasury directly from the CLI:
```shell
$ cast call $TREASURY_ADDRESS "totalStaked()(uint256)" --rpc-url $BASE_SEPOLIA_RPC
```

---

## 🛡️ Governance & Security

Bigview is designed with a **Transparent Treasury** model:
1.  **Staking:** Users stake ETH to secure the protocol.
2.  **Rewards:** BVW tokens are minted dynamically based on stake duration.
3.  **Governance:** Proposals are executed on-chain once the `votesFor` threshold is met.

### Help
```shell
$forge --help$ anvil --help
$ cast --help
```

---

**Developed with ❤️ by Henry Goodluck Chigozie (Bigview Creator)**