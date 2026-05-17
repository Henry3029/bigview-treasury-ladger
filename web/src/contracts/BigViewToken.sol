// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BigViewToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    
    error NotMinter();

    mapping(address => bool) public isMinter;

    // Renamed to reflect its status as your protocol's official LST
    constructor() 
        ERC20("Liquid Staked cbETH", "BVW") 
        ERC20Permit("Liquid Staked cbETH") 
        Ownable(msg.sender) 
    {}

    function addMinter(address _minter) external onlyOwner {
        isMinter[_minter] = true;
    }

    function removeMinter(address _minter) external onlyOwner {
        isMinter[_minter] = false;
    }

    function mint(address to, uint256 amount) external {
        if (!isMinter[msg.sender]) revert NotMinter();
        _mint(to, amount);
    }

    // Used when users burn BVW to permissionlessly withdraw their cbETH
    function burn(address from, uint256 amount) external {
        if (!isMinter[msg.sender]) revert NotMinter();
        _burn(from, amount);
    }

    // --- Required Overrides ---
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}