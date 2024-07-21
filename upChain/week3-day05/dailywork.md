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




