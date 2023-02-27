//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract blockchaintabs {
    string private name;
    uint256 public imageCount = 0;
    mapping(uint256 => Image) private images;

    struct Image {
        uint256 id;
        string hash;
        string content;
        address author;
    }
    Image[] newImages;
    event ImageCreated(uint256 id, string hash, string content, address author);

    function uploadImage(string memory _imgHash, string memory _content)
        public
    {
        // Make sure the image hash exists
        require(bytes(_imgHash).length > 0);
        // Make sure image description exists
        require(bytes(_content).length > 0);
        // Make sure uploader address exists
        require(msg.sender != address(0));

        // Increment image id
        imageCount++;

        // Add Image to the contract
        images[imageCount] = Image(
            imageCount,
            _imgHash,
            _content,
            address(msg.sender)
        );
        newImages.push(images[imageCount]);
        // Trigger an event
        emit ImageCreated(imageCount, _imgHash, _content, address(msg.sender));
    }

    function getData() public view returns (Image[] memory) {
        return newImages;
    }
}
