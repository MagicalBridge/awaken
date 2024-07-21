# 利用ABI逆向解码交易数据

## 题目描述：
当合约部署者没有上传合约源代码时，我们是否能逆向分析合约的方法信息呢？通过学习ABI相关知识，你可以结合公共数据来尝试逆向解析出一笔交易的执行意图！请解析这笔交易数据所表达的意图： 

0xa9059cbb0000000000000000000000005494befe3ce72a2ca0001fe0ed0c55b42f8c358f000000000000000000000000000000000000000000000000000000000836d54c

### 参考资料：
https://github.com/OpenSpace100/blockchain-tasks/blob/main/ppt/01.WhatIsABI.md

## 解题思路：
1. 解析出ABI信息
2. 解析出函数名
3. 解析出参数

要使用 Foundry 解码这笔 EVM 交易数据，你可以按照以下步骤操作：

1. 打开终端，进入你想要操作的项目目录。
2. 使用 `cast` 命令来解码数据。Foundry 的 `cast` 工具可以解码 EVM 交易数据。你可以使用 `cast abi-decode` 命令来解码交易数据。

首先，你需要知道这笔交易的 ABI（Application Binary Interface）。根据你提供的数据，`0xa9059cbb` 是一个方法的选择器，对应的方法是 `transfer(address,uint256)`。下面是一个示例步骤：

```sh
cast abi-decode "transfer(address,uint256)"
0xa9059cbb000000000000000000000000e78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0000000000000000000000000000000000000000000000000de0b6b3a7640000
```

# 使用 Viem 查询 USDC 最近100个区块内的转账记录

## 题目地址：
https://decert.me/quests/982e088b-f252-466b-8311-1a5834a7c8d1

Viem 是更先进的 web3 js SDK ，使用 viem 可便捷的和区块链交互。

## 题目1
使用 Viem 编写 ts 脚本查询 Ethereum 链上最近100个区块链内的 USDC Transfer记录，要求如下：

按格式输出转账记录:

从 0x099bc3af8a85015d1A39d80c42d10c023F5162F0 转账给 0xA4D65Fd5017bB20904603f0a174BBBD04F81757c 99.12345 USDC, 交易ID：0xd973feef63834ed1e92dd57a1590a4ceadf158f731e44aa84ab5060d17336281

给出完整的 ts 脚本

## 题解思路：
1、USDC本质上是一个合约，符合ERC20的标准，转账的时候会在链上抛出事件，就是 Transfer 这个事件。
2、










