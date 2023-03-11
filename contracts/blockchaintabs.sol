// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract blockchaintabs {
    string[] public ipfsHashes;

    event HashAdded(string ipfsHash);
//This function receives the url/hash from the user and stores it in the smart contract
    function addHash(string memory _ipfsHash) public {
        ipfsHashes.push(_ipfsHash);
        emit HashAdded(_ipfsHash);
    }
//This function gets all the url/hash stored in the smart contract and displays it.
    function getAllHashes() public view returns (string[] memory) {
        return ipfsHashes;
    }
}
