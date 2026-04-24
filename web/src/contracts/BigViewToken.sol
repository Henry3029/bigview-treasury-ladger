// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BigViewToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    // Mapping to manage multiple authorized minters (like your Treasury)
    mapping(address => bool) public isMinter;

    constructor() 
        ERC20("BigView", "BVW") 
        ERC20Permit("BigView") 
        Ownable(msg.sender) 
    {}

    /**
     * @notice Authorizes a contract (like the Treasury) to mint tokens
     */
    function addMinter(address _minter) external onlyOwner {
        isMinter[_minter] = true;
    }

    /**
     * @notice Removes a minter if needed for security
     */
    function removeMinter(address _minter) external onlyOwner {
        isMinter[_minter] = false;
    }

    /**
     * @notice Mints tokens. Only authorized minters can call this.
     */
    function mint(address to, uint256 amount) external {
        require(isMinter[msg.sender], "Not authorized to mint");
        _mint(to, amount);
    }

    // --- Required Overrides for ERC20Votes & ERC20Permit ---

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}