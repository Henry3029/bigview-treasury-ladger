// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Deploy this as your temporary twin test asset!
contract MockCbETH is ERC20 {
    constructor() ERC20("Mock Coinbase Wrapped Staked ETH", "cbETH") {
        _mint(msg.sender, 1000000 * 10**18); // Mint test tokens to yourself
    }

    // Faucet function so you can print more whenever you run out
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}