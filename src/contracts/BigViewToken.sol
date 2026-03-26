// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BigView Token (BVW)
 * @dev SIP-010 equivalent in Solidity (ERC-20)
 */
contract BigViewToken is ERC20, Ownable {
    
    // In Clarity, you defined decimals in a read-only function.
    // In Solidity, we pass name and symbol to the constructor.
    constructor() ERC20("BigView", "BVW") Ownable(msg.sender) {
        // Initial mint to the contract deployer (Henry Goodluck Chigozie)
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    /**
     * @dev Equivalent to your (mint ...) function.
     * Only the owner (Henry) can call this.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev In Solidity, decimals is usually 18 by default.
     * To match your Clarity contract (u6), we override it here.
     */
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    /** a
     * @dev Equivalent to get-token-uri. 
     * In Solidity, this is often handled by a baseURI or metadata standard.
     */
    function tokenURI() public pure returns (string memory) {
        return "ipfs://Qme7ss3ARVgxv6rXqVPiURzNFo5S/bigview.json";
    }
}