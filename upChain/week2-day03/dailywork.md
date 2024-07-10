# 使用Foundry编写Solidity单元测试

## 题目1

使用Foundry编写 Solidity单元测试是一种高效的方式来确保你的智能合约代码的健壯性和正确性。Foundry是一个由Solidity开发者社区广泛使用的智能合约开发和测试框架，它提供了一套强大的工具来编译、测试和部署Ethereum智能合约。


为银行合约的 DepositETH 方法编写测试 Case，检查以下内容：

断言检查 Deposit 事件输出是否符合预期。
断言检查存款前后用户在 Bank 合约中的存款额更新是否正确。

要求：直接提交完整的 `BankTest.sol` 测试合约源代码。

```solidity
contract Bank {
    mapping(address => uint) public balanceOf;

    event Deposit(address indexed user, uint amount);

    function depositETH() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
}
```
### 题解思路：

1、在github仓库中新建一个`foundry`工程项目。按照git初始化标准执行命令

2、在命令行执行 `foundryup`, 更新版本，包含四个常用的工具。

3、在目录中执行 `forge init --force` 添加 `--forre` 的原因是，我的项目中存在一个readme文件需要进行覆盖。

4、创建完毕之后，整个工程目录就算是搭建完毕了。

5、初始化的工程 `forge build` 可以将项目编译一下。

6、执行 `forge test` 将项目测试完成就可以了。

7、执行 `forge update` 和 `forge remove` 的前提条件是已经安装了包，否则也会失败

8、`forge remmaping > remmaping.txt` 将配置文件输出到根目录，以后使用自定义配置。

9、新建 `Bank.sol` 合约，将挑战的代码填写进去。

10、写测试用例：根据提示写测试用例。



