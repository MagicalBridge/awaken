// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bank {
    // 状态变量owner, 是合约的所有者
    address public owner;
    // 声明一个映射，地址类型 -> 账户的余额，合约内部访问
    mapping (address => uint256) private balances;
    // 一个数组，存放存款最多的用户
    address[] public topDepositors;

    // 声明一个事件，在取款的时候触发
    event Withdrawal(address indexed to, uint256 amount);
    // 声明一个事件，存钱的时候触发
    event Deposit(address indexed from, uint256 amount);

    constructor() {
        // 在构造函数中，将owner设置为msg.sender, 将部署的人设置为合约所有者
        owner = msg.sender;
    }

    // 权限控制，只有合约所有者才可以执行某些操作
    modifier onlyOwner () {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // 声明receive回调函数，允许合约接收主币
    receive() external payable {
        // 有人向合约发送以太币的时候，直接调用deposit函数
        deposit();
    }

    // 存款函数，允许外部账户向合约存入相应的以太币
    function deposit() public payable {
        // 用户发送的主币数量必须大于0;
        require(msg.value > 0, "Deposit amount must be greater than zero");
        // 更新每个地址的余额
        balances[msg.sender] += msg.value;
        // 更新排行榜
        updateTopDepositors(msg.sender);
        // 触发事件
        emit Deposit(msg.sender, msg.value);
    }

    // 取款函数，只允许合约拥有者提款
    function withdraw(uint256 amount) public onlyOwner {
        // 获取当前Bank合约的余额
        uint256 balance = address(this).balance;
        // 如果余额不足，不再支持取款
        require(balance > 0, "Contract balance is zero");
        // 提取的金额应该小于目前这个合约中存在的钱
        require(amount <= balance, "Insufficient contract balance");
        // 合约所有者，可以取款，单位是wei, 注意进制的转换。
        payable(owner).transfer(amount);
        // 触发取款事件
        emit Withdrawal(owner, amount);
    }

    // 不断更新排名
    function updateTopDepositors(address depositor) internal {
        // 设置一个标识，避免重复添加
        bool exists = false;

        // 遍历数组,如果当前地址已经存在于topDepositors中，跳出循环
        for (uint256 i = 0; i < topDepositors.length; i++) {
            if (topDepositors[i] == depositor) {
                exists = true;
                break;
            }
        }
        // 如果不存在，将当前的地址放入数组中
        if (!exists) {
            topDepositors.push(depositor);
        }

        for (uint256 i = 0; i < topDepositors.length; i++) {
            for (uint256 j = i + 1; j < topDepositors.length; j++) {
                if (balances[topDepositors[i]] < balances[topDepositors[j]]) {
                    address temp = topDepositors[i];
                    topDepositors[i] = topDepositors[j];
                    topDepositors[j] = temp;
                }
            }
        }

        // 数组长度大于3之后，只保存前三个。
        if (topDepositors.length > 3) {
            topDepositors.pop();
        }
    }

    // 根据指定地址查看账户余额
    function getBalance(address addr) public view returns(uint256) {
        return balances[addr];
    }

    // 返回存钱排行榜
    function getTopDepositors() public view returns (address[] memory) {
        return topDepositors;
    }
}