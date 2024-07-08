# 掌握ERC20 token 代币标准

## 题目1 编写 ERC20 token 合约

### 介绍
ERC20 是以太坊区块链上最常用的 Token 合约标准。通过这个挑战，你不仅可以熟悉 Solidity 编程，而且可以了解 ERC20 Token 合约的工作原理。

### 目标

完善合约，实现以下功能：

```
设置 Token 名称（name）："BaseERC20"
设置 Token 符号（symbol）："BERC20"
设置 Token 小数位decimals：18
设置 Token 总量（totalSupply）：100,000,000

允许任何人查看任何地址的 Token 余额（balanceOf）

允许 Token 的所有者将他们的 Token 发送给任何人（transfer）；转帐超出余额时抛出异常(require), 并显示错误消息 "ERC20: transfer amount exceeds balance"。

允许 Token 的所有者批准某个地址消费他们的一部分Token（approve）

允许任何人查看一个地址可以从其它账户中转账的代币数量（allowance）

允许被授权的地址消费他们被授权的 Token 数量（transferFrom）；

转帐超出余额时抛出异常(require)，异常信息："ERC20: transfer amount exceeds balance"

转帐超出授权数量时抛出异常(require)，异常消息："ERC20: transfer amount exceeds allowance"。

注意:
在编写合约时，需要遵循`ERC20`标准，此外也需要考虑到安全性，确保转账和授权功能在任何时候都能正常运行无误。
代码模板中已包含基础框架，只需要在标记为 "Write your code here" 的地方编写你的代码。不要去修改已有内容！

希望你能用一段优雅、高效和安全的代码，完成这个挑战。
```

## 题目2：

编写一个 `TokenBank` 合约，可以将自己的 Token 存入到 TokenBank， 和从 TokenBank 取出。

TokenBank 有两个方法：
- `deposit()`: 需要记录每个地址的存入数量。
- `withdraw()`: 用户可以提取自己的之前存入的token。

在回答框内输入你的代码或者 github 链接。

### 题解思路：
1、这个合约中的一个mapping数据结构应该是这样的：一个token合约部署的地址作为

```
ERC20TokenContractAddress: {
  address: value // 用户: 用户在TokenBank这个合约中有多少ERC20Token。
}
```

2、TokenBank 其实是个中介。可以管理用户在这个合约中 不同的ERC20代币的数量。


### 测试步骤：
1、在测试网上部署ERC20Token合约，部署后的地址为：0x2f91329978dbb23fea7fe89ab98c24be808537b0

2、在matemask钱包中导入对应的token。按照逻辑，首发的代币全部存入了我的钱包。

3、然后部署TokenBank合约，为了验证差异性，我换一个钱包账户去部署这个TokenBank合约。这里需要注意一个细节，就是引入正确的接口。

4、将部署的合约地址拷贝下来： 0xc4c85b3aadced03c018e7dba42718104f33d7166 TokenBank

5、测试将自己的token存入这个地址中。



