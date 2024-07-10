# 扩展ERC20并加入hook, 并使用hook

## 题目1

扩展 ERC20 合约，使其具备在转账的时候，如果目标地址是合约的话，调用目标地址的 tokensReceived() 方法.

请贴出你的代码或代码库链接。

### 题解思路：
1、尝试使用openzeppelin提供的ERC20去实现，自己定义一个新的Token, 直接去mint做相关操作。这应该是大部分生产环境的Token的实现方案，或者我的理解有问题。

2、目前我这个Token不限制任何人mint，大家都可以mint，然后放入自己的钱包。

3、我实际是在尝试实现一个`ERC1363`的TOKEN，这个认知还是非常重要的。

## 题目2
扩展 TokenBank, 在TokenBank 中利用上一题的转账回调实现存款。

提出扩展后的TokenBank代码或代码库链接。

### 题解思路:

1、首先部署`ERC20的Token`, 得到ERC20token的合约地址。
  ERC20的Token地址：`0xc674C85c95663383472ed828Bb9D39a5D1A2DD57`
  由 `0x2b754dEF498d4B6ADada538F01727Ddf67D91A7D` 自己的地址mint 总量：1000000000 个

2、部署带有回调函数的 `tokenBank` 
  TokenBank的地址：`0x8BaCa5a3cEd92d54eAdB3BfD0E94a8f7F6Fd8456` 

3、调用 `ERC20的Token` 合约的方法，向 `tokenBank` 转钱; 触发回调，可以记录转过去的余额

4、使用基本的transfer也可以完成转账，但是转过去币就丢了，没有办法记录这个映射。

## 题目3 
扩展挑战 Token购买NFT 合约，能够使用ERC20扩展中的回调函数来购买某个 NFT ID。

贴出你的代码或代码库链接。

### 题解思路
1、这个题目需要在NFT_Market合约的基础上去做，在原本的交互流程中，token需要给指定的合约授权额度。这里可以基于1363去实现，减少用户授权成本。

### 测试用例步骤

1、首先在测试网部署token，部署的地址为: 0x77a8Eaf5fED0a63E01a3FDd4529123B8e08158dD

2、用我自己的账户1: 0x2b754dEF498d4B6ADada538F01727Ddf67D91A7D 进行mint操作，1000000000,然后添加到钱包中，用于交互;

3、部署NFT合约（ERC721合约, 地址）: 0xA4203a92b9D40Bb89AAc7D7F0d2eb4E3ED4EA411 

4、我使用: 0x2b754dEF498d4B6ADada538F01727Ddf67D91A7D mint了一个NFT, 当前这个合约中只有一个NFT, id就是1。

5、部署 NFT_Market_Advance 合约，入参是ERC20合约和ERC721的合约地址: 0x11a70E69201BbF6aB1D1530a0Db65d6125D2fef4

6、部署成功之后，用户应该怎么交互才能将NFT转移到市场合约? 用户调用NFT合约的，safeTransferFrom 函数，NFT 转移到市场合约，并在 data 参数中指定价格。
需要调用四个参数 safetransfer, 看看能不能成功

7、

# Solidity 实现用Token 购买 NFT

## 题目1
用 ERC721 标准发行一个自己 NFT 合约，并用图片铸造几个 NFT ， 请把图片和 Meta Json数据上传到去中心的存储服务中，请贴出在 OpenSea 的 NFT 链接。

## 题目2
编写一个简单的 NFT市场合约，使用自己的发行的 Token 来买卖 NFT， 函数的方法有：

list() : 实现上架功能，NFT 持有者可以设定一个价格（需要多少个 Token 购买该 NFT）并上架 NFT 到 NFT 市场。
buyNFT() : 实现购买 NFT 功能，用户转入所定价的 token 数量，获得对应的 NFT。
请在回答贴出你的代码或者 github 链接。

### 题解思路
1、首先部署`ERC20的Token`, 得到ERC20token的合约地址。
  ERC20的Token地址：`0xc674C85c95663383472ed828Bb9D39a5D1A2DD57`
  由 `0x2b754dEF498d4B6ADada538F01727Ddf67D91A7D` 自己的地址mint 总量：1000000000 个

2、在部署的钱包中添加相关的Token，方便后续的交互。已经添加完成；

3、部署`ERC721合约`，并mint一个NFT。这个NFT属于当前的钱包地址。
  ERC721合约地址：`0x71bfCA485f607fD185E56A3656aeB7051333Ec43`

4、部署 NFT_MARKET 合约，入参是ERC20合约和ERC721的合约地址。

5、需要将 执行交易的人授权一定的代币额度给 NFT_MARKET。不然在内部调用方法肯定会报错的。

6、需要 ERC721合约 授权 NFT_MARKET 合约 代管自己的NFT，方便转移给别人。





