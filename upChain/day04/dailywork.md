# 用 Solidity 编写 BigBank 智能合约

## 题目1
编写一个`BigBank`合约，它继承自 `Bank` 合约，并实现功能：

- 要求存款金额 >0.001 ether（用modifier权限控制）
- BigBank 合约支持转移管理员
- 同时编写一个 Ownable 合约，把 BigBank 的管理员转移给Ownable 合约， 实现只有Ownable 可以调用 BigBank 的 withdraw().
- 编写 withdraw() 方法，仅管理员可以通过该方法提取资金。
- 用数组记录存款金额的前 3 名用户

请提交完成项目代码或 github 仓库地址。

### 解题思路
1、整体的合约设计应该分层，最上层需要抽象出来相关的接口，然后Bank合约的实现需要继承这个接口。

2、实现接口的过程中需要注意对于关键字的使用，对于函数的定义都是external关键字修饰的。事件定义按照按照相关的规范需要写在函数定义的上面。

3、在实现合约中，实现函数需要添加 override 关键字, 这是继承相关的规范。

4、需要创建一个`BigBank`合约，这个合约需要继承 `OriginalBank` 合约，并重写存款函数。这里只修改修饰符，其他逻辑不变

5、因为 `BigBank` 合约继承了 `OriginalBank` 合约，它在部署之后，很明显具备继承合约的一些函数和属性

6、需要一个 Ownable 合约，这个合约是单独部署的，我们可以在 `BigBank` 中实现一个方法，可以将合约的所有权转移给Ownable合约。

7、转移之后对于`BigBank`合约来说，它就是不能再调用自己的withdraw方法了。因为所有权已经转移。

8、在Ownable函数中也有一个withdraw方法，这个方法内部会调用BigBank的withdraw方法, 是用合约的地址调用这个方法。

### 测试用例

1、部署顺序，先部署`BigBank`合约, 验证取款的金额必须大于0.001 ether；

2、验证其他三个账号向其中转账，金额都不同，最后只有部署合约的账号可以取款；

3、部署Ownable合约，得到一个地址，将BigBank合约的所有权转移给它，此时，BigBank 就无法调用提款方法了。因为合约所有权已经转移；

4、切换为部署Ownable合约的账号，调用取款方法，可以成功取款不会报错。

1、0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 部署bigbank合约，部署的地址 0x3c725134d74D5c45B4E4ABd2e5e2a109b5541288

2、其他三个账号向其中转钱：小额转钱报错，金额太小
  0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2 --- 1ETH
  0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db --- 2ETH
  0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB --- 3ETH

3、测试这三个地址是否可以取款，期望不可以，没有权限 

4、0x617F2E2fD72FD9D5503197092aC168c91465E7f2 这个地址部署 Ownable 合约

5、在bigbank合约中调用转移权限函数，将权限给 0x617F2E2fD72FD9D5503197092aC168c91465E7f2 给这个地址。注意只有 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 目前可以调用转移权限函数。

6、转移之后bigbank的所有者就变成了0x617F2E2fD72FD9D5503197092aC168c91465E7f2，0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 无法调用取款函数。

7、此时在Ownable 合约中设置 部署的地址 0x3c725134d74D5c45B4E4ABd2e5e2a109b5541288。






