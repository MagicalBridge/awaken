// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC1363Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract OptimizedNFTMarketplace is IERC721Receiver, IERC1363Receiver {
    IERC20 public immutable tokenContract;
    IERC721 public immutable nftContract;

    struct Listing {
        address seller;
        uint256 price;
    }

    mapping(uint256 => Listing) public listings;

    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);

    constructor(address _tokenAddress, address _nftAddress) {
        tokenContract = IERC20(_tokenAddress);
        nftContract = IERC721(_nftAddress);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        require(msg.sender == address(nftContract), "Invalid NFT contract");
        
        // 解码 data 以获取价格
        uint256 price = abi.decode(data, (uint256));
        
        // 创建 listing
        listings[tokenId] = Listing(from, price);
        
        emit NFTListed(tokenId, from, price);
        
        return this.onERC721Received.selector;
    }

    function onTransferReceived(
        address operator,
        address from,
        uint256 value,
        bytes memory data
    ) external override returns (bytes4) {
        require(msg.sender == address(tokenContract), "Invalid token contract");
        
        // 解码 data 以获取 tokenId
        uint256 tokenId = abi.decode(data, (uint256));
        
        Listing memory listing = listings[tokenId];
        require(listing.seller != address(0), "NFT not listed");
        require(value >= listing.price, "Insufficient payment");
        
        // 处理购买逻辑
        delete listings[tokenId];
        
        // 转移 NFT 给买家
        nftContract.safeTransferFrom(address(this), from, tokenId);
        
        // 如果支付金额超过价格，退还多余的代币
        if (value > listing.price) {
            uint256 refund = value - listing.price;
            require(tokenContract.transfer(from, refund), "Refund failed");
        }
        
        // 将价格转给卖家
        require(tokenContract.transfer(listing.seller, listing.price), "Payment transfer failed");
        
        emit NFTSold(tokenId, listing.seller, from, listing.price);
        
        return this.onTransferReceived.selector;
    }

    // 实现 IERC165 的 supportsInterface 函数
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return
            interfaceId == type(IERC721Receiver).interfaceId ||
            interfaceId == type(IERC1363Receiver).interfaceId;
    }
}