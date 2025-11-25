// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GenesisSynapse
 * @dev The "Angel Round" NFT for Kiasma Network.
 *      Provides fee waivers and revenue share rights.
 */
contract GenesisSynapse is ERC721Enumerable, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 300;
    uint256 public constant MINT_PRICE = 1 ether; // Placeholder, can be adjustable

    // Base URI for metadata
    string private _baseTokenURI;

    constructor(string memory baseURI) ERC721("Kiasma Genesis Synapse", "KGS") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    /**
     * @notice Mints a new Genesis Synapse NFT.
     * @dev Requires payment of MINT_PRICE.
     */
    function mint() external payable nonReentrant {
        uint256 supply = totalSupply();
        require(supply < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= MINT_PRICE, "Insufficient ETH sent");

        _safeMint(msg.sender, supply + 1);
    }

    /**
     * @notice Checks if a user holds a Genesis Synapse NFT.
     * @dev Used by KiasmaVault to determine if management fee should be waived.
     * @param user The address to check.
     * @return bool True if the user holds at least one NFT.
     */
    function checkFeeWaiver(address user) external view returns (bool) {
        return balanceOf(user) > 0;
    }

    /**
     * @notice Allows the owner to withdraw collected ETH.
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
}
