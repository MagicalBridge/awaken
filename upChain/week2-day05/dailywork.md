# 使用Foundry部署和开源合约

通过学习，掌握使用 Foundry 一键部署合约技能，也能在部署后也可一键将合约开源到区块链浏览器中。

## 题目1:
将下方合约部署到 https://sepolia.etherscan.io/ ，要求如下：

要求使用你在 Decert.met 登录的钱包来部署合约
要求贴出编写 forge script 的脚本合约
并给出部署后的合约链接地址

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 { 
    constructor(string name_, string symbol_) ERC20(name_, symbol_) {
        _mint(msg.sender, 1e10*1e18);
    } 
}
```

### 题解思路
1、我将在BankApp项目中，新建一个ERC20的token, 使用上面题目中提供的模板文件。

2、首先部署到foundry本地的网络上面。

3、然后部署到测试网络上面


## 题目2
将题目1中部署合约在 https://sepolia.etherscan.io/ 中开源，要求给出对应的合约链接


### 题解思路

通过编写部署脚本，进行部署
参考文章：https://learnblockchain.cn/article/8678


# 使用 Viem 读取NFT合约信息

## 题目
使用 Viem.sh 读取该 NFT 0x0483b0dfc6c78062b9e999a82ffb795925381415 合约信息：

读取 NFT 合约中指定 NFT 的持有人地址：See {IERC721-ownerOf}
读取指定NFT的元数据：tokenURI(uint256)returns(string)
要求直接提交实现该功能的 TS 文件内容，或者 Github 文件链接

### 题解思路
核心就是熟悉viem的相关api去读取链上信息。

1、将viem做为一个ts模块安装进来，可以使用它和链上做通信。

2、新建一个项目工程来专门学习这部分的内容：https://github.com/MagicalBridge/what-the-viem






