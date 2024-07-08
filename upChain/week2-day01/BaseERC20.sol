// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BaseERC20 {
    string public name; // token 的name
    string public symbol; // token 的唯一标识
    uint8 public decimals; // 精度

    uint256 public totalSupply;

    // 这个合约内，{ 地址 -> 余额 }
    mapping(address => uint256) balances;

    mapping(address => mapping(address => uint256)) allowances;

    /**
     * description 转账事件
     * @param from 从哪个地址转出
     * @param to 目标地址
     * @param value 转账的数量
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    // 主要的四个变量就已经实现了
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        balances[msg.sender] = _totalSupply;
    }

    // 入参是个地址类型，返回指定地址的余额
    function balanceOf(address _owner) public view returns (uint256 balance) {
        // write your code here
        return balances[_owner];
    }

    // 可以支持转账，这个转账需要考虑的点还是挺多的。
    // 需要判断用户的余额够不够用
    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // write your code here

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // write your code here

        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        // write your code here

        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(
        address _owner,
        address _spender
    ) public view returns (uint256 remaining) {
        // write your code here
    }
}
