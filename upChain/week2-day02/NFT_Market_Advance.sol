// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC1363Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract OptimizedNFTMarketplace is ERC165, IERC721Receiver, IERC1363Receiver {
    IERC20 public immutable tokenContract;
    IERC721 public immutable nftContract;

    struct Listing {
        address seller;
        uint256 price;
    }

    mapping(uint256 => Listing) public listings;

    event NFTListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    event NFTSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );

    constructor(address _tokenAddress, address _nftAddress) {
        tokenContract = IERC20(_tokenAddress);
        nftContract = IERC721(_nftAddress);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override returns (bool) {
        return
            interfaceId == type(IERC721Receiver).interfaceId ||
            interfaceId == type(IERC1363Receiver).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function onERC721Received(
        address,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        require(msg.sender == address(nftContract), "Invalid NFT contract");

        uint256 price = abi.decode(data, (uint256));
        _listNFT(from, tokenId, price);

        return this.onERC721Received.selector;
    }

    function onTransferReceived(
        address,
        address from,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        require(msg.sender == address(tokenContract), "Invalid token contract");

        uint256 tokenId = abi.decode(data, (uint256));
        _buyNFT(from, tokenId, value);

        return this.onTransferReceived.selector;
    }

    function _listNFT(address seller, uint256 tokenId, uint256 price) internal {
        listings[tokenId] = Listing(seller, price);
        emit NFTListed(tokenId, seller, price);
    }

    function _buyNFT(address buyer, uint256 tokenId, uint256 value) internal {
        Listing memory listing = listings[tokenId];
        require(listing.seller != address(0), "NFT not listed");
        require(value >= listing.price, "Insufficient payment");

        delete listings[tokenId];

        // 转移 ERC20 代币
        require(
            tokenContract.transfer(listing.seller, listing.price),
            "Token transfer failed"
        );

        // 如果支付金额超过价格，退回多余的代币
        if (value > listing.price) {
            require(
                tokenContract.transfer(buyer, value - listing.price),
                "Refund failed"
            );
        }

        // 转移 NFT
        nftContract.safeTransferFrom(address(this), buyer, tokenId);

        emit NFTSold(tokenId, listing.seller, buyer, listing.price);
    }

    // 允许卖家取消上架
    function cancelListing(uint256 tokenId) external {
        require(listings[tokenId].seller == msg.sender, "Not the seller");
        delete listings[tokenId];
        nftContract.safeTransferFrom(address(this), msg.sender, tokenId);
    }
}
