// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// NFTMarketplace 合约允许用户使用自定义的 ERC20 代币购买和出售 NFT
contract NFTMarketplace {
    // 定义 ERC20 代币和 ERC721 NFT 合约的接口
    IERC20 public immutable tokenContract;
    IERC721 public immutable nftContract;

    // 列出 NFT 的结构体，包含卖家的地址和价格
    struct Listing {
        address seller;
        uint256 price;
    }

    // tokenId 到 Listing 结构体的映射，用于存储所有上架的 NFT
    mapping(uint256 => Listing) public listings;

    // 事件：当 NFT 被上架时触发
    event NFTListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    // 事件：当 NFT 被售出时触发
    event NFTSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );

    // 构造函数，初始化合约时设置 ERC20 代币合约和 ERC721 NFT 合约的地址
    constructor(address _tokenAddress, address _nftAddress) {
        tokenContract = IERC20(_tokenAddress);
        nftContract = IERC721(_nftAddress);
    }

    // 上架函数，允许 NFT 持有者将 NFT 上架并设置价格
    function list(uint256 _tokenId, uint256 _price) external {
        // 确保调用者是 NFT 的持有者
        require(nftContract.ownerOf(_tokenId) == msg.sender, "Not the owner");
        // 确保市场合约被授权转移该 NFT
        require(
            nftContract.getApproved(_tokenId) == address(this),
            "NFT not approved"
        );

        // 将 NFT 信息添加到 listings 映射中
        listings[_tokenId] = Listing(msg.sender, _price);

        // 触发 NFTListed 事件
        emit NFTListed(_tokenId, msg.sender, _price);
    }

    // 购买 NFT 函数，允许用户购买上架的 NFT
    function buyNFT(uint256 _tokenId) external {
        // 获取该 NFT 的 Listing 信息
        Listing memory listing = listings[_tokenId];
        // 确保该 NFT 已上架
        require(listing.seller != address(0), "NFT not listed");

        // 从 listings 映射中删除该 NFT 的信息
        delete listings[_tokenId];

        // 从买家账户转移相应数量的 ERC20 代币到卖家账户
        require(
            tokenContract.transferFrom(
                msg.sender,
                listing.seller,
                listing.price
            ),
            "Token transfer failed"
        );
        // 将 NFT 从卖家账户转移到买家账户
        nftContract.safeTransferFrom(listing.seller, msg.sender, _tokenId);

        // 触发 NFTSold 事件
        emit NFTSold(_tokenId, listing.seller, msg.sender, listing.price);
    }
}
