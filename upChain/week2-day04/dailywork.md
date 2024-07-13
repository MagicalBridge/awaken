# Foundry 高阶测试


## 题目1
https://decert.me/quests/08973815-3ebe-48d1-915e-7fc67c448763

测试 NFTMarket 合约：测试Case
❖ 上架NFT：测试上架成功和失败情况，要求断⾔错误信息和上架事件。
❖ 购买NFT：测试购买成功、⾃⼰购买⾃⼰的NFT、NFT被重复购买、⽀付Token过多或者过
少情况，要求断⾔错误信息和购买事件。
❖ 模糊测试：测试随机使⽤ 0.01-10000 Token价格上架NFT，并随机使⽤任意Address购买
NFT
❖ 「可选」不可变测试：测试⽆论如何买卖，NFTMarket合约中都不可能有 Token 持仓

### 测试思路：
1、在foundry中，写测试用例使用的solidity这个语言，本质上就是模拟一些环境去做事情。

具体项目地址：

https://github.com/MagicalBridge/NFTMarket

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {NFTMarket} from "../src/NFTMarket.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract MockERC20 is ERC20 {
    constructor() ERC20("MockToken", "MTK") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract MockERC721 is ERC721 {
    uint256 private _tokenIdCounter;
    constructor() ERC721("MockNFT", "MNFT") {}

    function mint(address to) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _tokenIdCounter++;
        return tokenId;
    }
}

contract NFTMarketTest is Test {
    NFTMarket public market;
    MockERC20 public token;
    MockERC721 public nft;

    // 事件：当 NFT 被上架时触发
    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);

    function setUp() public {
        token = new MockERC20();
        nft = new MockERC721();
        market = new NFTMarket(address(token), address(nft));
    }

    // 测试构造函数
    function testContractAddresses() public view {
        assertEq(address(market.tokenContract()), address(token), "Token contract address mismatch");
        assertEq(address(market.nftContract()), address(nft), "NFT contract address mismatch");
    }

    

    // 可以成功上架NFT
    function testNFTOwnerCanList() public {
        address user = address(0x01);

        // 给用户mint一个NFT
        uint256 tokenId = nft.mint(user);

        // 切换为这个mock用户
        vm.startPrank(user);

        // 授权market托管用户的NFT
        nft.approve(address(market), tokenId);

        // List the NFT
        uint256 listingPrice = 100 * (10**18);
        vm.expectEmit();
        emit NFTListed(tokenId, user, listingPrice); // 期望的事件
        market.list(tokenId, listingPrice);
        // 停止mock用户
        vm.stopPrank();

        // 测试上架信息
        (address sellPerson, uint256 price) = market.listings(tokenId);
        assertEq(sellPerson, user, "Seller should be the user");
        assertEq(price, listingPrice, "Listing price should match");

    }

    // 没有授权无法上架
    function testNFTNotApprovedCannotList() public {
        address user = address(0x02);

        // 给用户mint一个NFT
        uint256 tokenId = nft.mint(user);

        // 切换为这个mock用户
        vm.startPrank(user);

        // 尝试不授权直接上架NFT
        uint256 listingPrice = 100 * (10**18);

        // 预期会触发一个错误，因为NFT未被授权给市场
        vm.expectRevert("ERC721: transfer caller is not owner nor approved");
        market.list(tokenId, listingPrice);

        // 停止模拟用户
        vm.stopPrank();
    }

    // 测试用户并不拥有NFT权限，转账失败
    function testUserDoesNotOwnNFTCannotList() public {
        address user = address(0x03);

        // 给另一个非测试用户mint一个NFT
        address differentUser = address(0x123);
        uint256 tokenId = nft.mint(differentUser);

        // 切换为测试用户
        vm.startPrank(user);

        // 即使授权某种原因成功了，尝试上架也应该失败
        uint256 listingPrice = 100 * (10**18);
        vm.expectRevert("ERC721: transfer of token that is not own");
        market.list(tokenId, listingPrice);

        // 停止mock用户
        vm.stopPrank();
    }
    // 购买
    function testBuyNFT() public {
        address seller = address(0x03);
        uint256 listingPrice = 100 * (10**18);
        uint256 tokenId = nft.mint(seller);
        address buyer = address(0x04);

        // 用户上架NFT
        vm.startPrank(seller);
        nft.approve(address(market), tokenId);
        market.list(tokenId, listingPrice);
        vm.stopPrank();

        // 给用户冲钱
        token.mint(buyer, listingPrice);

        // 买家角色准备
        vm.startPrank(buyer);
        token.approve(address(market), listingPrice);
        vm.expectEmit(true, true, true, true);
        emit NFTSold(tokenId, seller, buyer, listingPrice);
        market.buyNFT(tokenId);
        vm.stopPrank();

        // 验证所有权
        assertEq(nft.ownerOf(tokenId), buyer, "Buyer should now own the NFT");
        assertEq(token.balanceOf(seller), listingPrice, "Seller should have received the payment");
        assertEq(token.balanceOf(buyer), 0, "Buyer's tokens should have been spent");

        // 验证上架信息为空
        (address listedSeller, uint256 listedPrice) = market.listings(tokenId);
        assertEq(listedSeller, address(0), "NFT should no longer be listed");
        assertEq(listedPrice, 0, "Listed price should be zero");
    }
    // 自己购买自己的
    function testSelfBuyNFT() public {
        address userSelf = address(3);
        uint256 listingPrice = 100 ether;
        uint256 tokenId = nft.mint(userSelf);

        // 用户上架NFT
        vm.startPrank(userSelf);
        nft.approve(address(market), tokenId);
        market.list(tokenId, listingPrice);

        // 给用户充钱
        token.mint(userSelf, listingPrice);

        // 用户授权market使用的token额度
        token.approve(address(market), listingPrice);

        address initialNFTOwner = nft.ownerOf(tokenId);

        // 用户尝试自己购买NFT
        market.buyNFT(tokenId);
        vm.stopPrank();

        assertEq(nft.ownerOf(tokenId), initialNFTOwner, "NFT ownership should not change");
        assertEq(token.balanceOf(userSelf), listingPrice, "User's token balance should decrease");

        (address listedSeller, uint256 listedPrice) = market.listings(tokenId);
        assertEq(listedSeller, address(0), "NFT should no longer be listed");
        assertEq(listedPrice, 0, "Listed price should be zero");
    }
    // 重复购买
    function testRepeatedBuyNFT() public {
        address seller = address(0x04);
        uint256 listingPrice = 100 * (10**18);
        uint256 listingPrice2 = 200 * (10**18);
        uint256 tokenId = nft.mint(seller);

        address  buyer1 = address(0x05);
        address  buyer2 = address(0x06);

        // 卖家上架NFT
        vm.startPrank(seller);
        nft.approve(address(market), tokenId);
        market.list(tokenId, listingPrice);
        vm.stopPrank();

        // 给买家1充钱
        token.mint(buyer1, listingPrice);

        // 买家1充钱、授权市场使用额度
        vm.startPrank(buyer1);
        token.approve(address(market), listingPrice);
        market.buyNFT(tokenId);
        vm.stopPrank();

        // 买家1拥有NFT的所有权
        assertEq(nft.ownerOf(tokenId), buyer1, "Buyer1 should now own the NFT");
        
        // 给买家2充钱
        token.mint(buyer2, listingPrice2);

        // 买家2授权给市场额度
        vm.startPrank(buyer2);
        token.approve(address(market), listingPrice2);
        
        // 期望抛出异常
        vm.expectRevert("NFT not listed");
        market.buyNFT(tokenId);
        vm.stopPrank();

        // 买家1依然拥有所有权
        assertEq(nft.ownerOf(tokenId), buyer1, "Buyer1 should still own the NFT");

        // Verify that buyer2's balance hasn't changed
        assertEq(token.balanceOf(buyer2), listingPrice2, "Buyer2's balance should remain unchanged");

        // Verify the NFT is not listed
        (address listedSeller, uint256 listedPrice) = market.listings(tokenId);
        assertEq(listedSeller, address(0), "NFT should not be listed");
        assertEq(listedPrice, 0, "Listed price should be zero");
    }
    // 多付钱
    function testBuyNFTWithOverpayment() public {
        address seller = address(0x07);
        address buyer = address(0x08);
        uint256 listingPrice = 100 * (10**18);
        uint256 overpaymentAmount = 150 * (10**18);
        uint256 tokenId = nft.mint(seller);

        vm.startPrank(seller);
        nft.approve(address(market), tokenId);
        market.list(tokenId, listingPrice);
        vm.stopPrank();

        token.mint(buyer, overpaymentAmount);

        vm.startPrank(buyer);
        token.approve(address(market), overpaymentAmount);
        market.buyNFT(tokenId);
        vm.stopPrank();

        assertEq(nft.ownerOf(tokenId), buyer, "Buyer should now own the NFT");
        assertEq(token.balanceOf(seller), listingPrice, "Seller should have received the listing price");
        assertEq(token.balanceOf(buyer), overpaymentAmount - listingPrice, "Buyer should have the correct remaining balance");

        (address listedSeller, uint256 listedPrice) = market.listings(tokenId);
        assertEq(listedSeller, address(0), "NFT should no longer be listed");
        assertEq(listedPrice, 0, "Listed price should be zero");
    }

    // 少付钱
    function testBuyNFTWithUnderpayment() public {
        address seller = address(0x09);
        address buyer = address(0x010);
        uint256 listingPrice = 100 *(10**18);
        uint256 underpaymentAmount = 50 * (10**18);
        uint256 tokenId = nft.mint(seller);

        vm.startPrank(seller);
        nft.approve(address(market), tokenId);
        market.list(tokenId, listingPrice);
        vm.stopPrank();

        token.mint(buyer, underpaymentAmount);

        vm.startPrank(buyer);
        token.approve(address(market), underpaymentAmount);
        
        vm.expectRevert("ERC20: transfer amount exceeds balance");
        market.buyNFT(tokenId);
        vm.stopPrank();

        assertEq(nft.ownerOf(tokenId), seller, "Seller should still own the NFT");
        assertEq(token.balanceOf(seller), 0, "Seller's balance should remain unchanged");
        assertEq(token.balanceOf(buyer), underpaymentAmount, "Buyer's balance should remain unchanged");

        (address listedSeller, uint256 listedPrice) = market.listings(tokenId);
        assertEq(listedSeller, seller, "NFT should still be listed");
        assertEq(listedPrice, listingPrice, "Listed price should remain unchanged");
    }

    // 模糊测试
    function testRandomListingAndBuying(uint256 price) public {
        address  user = address(1);

        address  buyerAddress = address(0x33);
        uint256  MAX_PRICE = 10000 * (10 ** 18);
        uint256  MIN_PRICE = 1 * (10**16); // 0.01 token
        

        // 确保price在0.01到10000个Token之间
        price = bound(price, MIN_PRICE, MAX_PRICE);

        // 给用户和买家mint一些ERC20代币
        token.mint(user, MAX_PRICE);
        token.mint(buyerAddress, MAX_PRICE);

        // 给用户mint一个NFT
        uint256 tokenId = nft.mint(user);

        // 切换为这个mock用户
        vm.startPrank(user);

        // 授权market托管用户的NFT
        nft.approve(address(market), tokenId);

        // List the NFT
        market.list(tokenId, price);

        // Stop acting as the user
        vm.stopPrank();

        // 切换为随机买家
        vm.startPrank(buyerAddress);

        // 授权market从买家账户转移ERC20代币
        token.approve(address(market), price);

        // 买家购买NFT
        if (token.balanceOf(buyerAddress) >= price && token.allowance(buyerAddress, address(market)) >= price) {
            console.log(buyerAddress);
            market.buyNFT(tokenId);
            assertEq(nft.ownerOf(tokenId), buyerAddress, "Buyer should own the NFT");
        }

        // Stop acting as the buyer
        vm.stopPrank();
    }

    function testNoTokenHoldingsInMarket() public {
        address user = address(0x12);
        address buyer = address(0x013);
        uint256  MAX_PRICE = 10000 * (10 ** 18);
        // 给用户和买家mint一些ERC20代币
        token.mint(user, MAX_PRICE);
        token.mint(buyer, MAX_PRICE);

        // 给用户mint一个NFT
        uint256 tokenId = nft.mint(user);

        // 切换为这个mock用户
        vm.startPrank(user);

        // 授权market托管用户的NFT
        nft.approve(address(market), tokenId);

        // List the NFT
        uint256 listingPrice = 100 * 10**18; // 定价为 100 个 ERC20 代币
        market.list(tokenId, listingPrice);

        // Stop acting as the user
        vm.stopPrank();

        // 检查市场合约中没有代币余额
        assertEq(token.balanceOf(address(market)), 0, "Market contract should not hold any tokens");

        // 切换为买家
        vm.startPrank(buyer);

        // 授权market从买家账户转移ERC20代币
        token.approve(address(market), listingPrice);

        // 买家购买NFT
        market.buyNFT(tokenId);

        // 停止模拟买家
        vm.stopPrank();

        // 再次检查市场合约中没有代币余额
        assertEq(token.balanceOf(address(market)), 0, "Market contract should not hold any tokens after purchase");
    }
}
```
