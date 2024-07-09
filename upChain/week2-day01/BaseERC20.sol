// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BaseERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;

    uint256 public totalSupply;

    mapping(address => uint256) balances;

    mapping(address => mapping(address => uint256)) allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor() {
        name = "BaseERC20";
        symbol = "BERC20";
        decimals = 18;
        totalSupply = 100000000 * (10 ** 18);

        balances[msg.sender] = totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        require(
            _owner != address(0),
            "ERC20: balance query for the zero address"
        );
        return balances[_owner];
    }

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_to != address(0), "ERC20: transfer to the zero address");
        require(_value > 0, "ERC20: transfer amount must be greater than zero");

        uint256 senderBalance = balances[msg.sender];
        require(
            senderBalance >= _value,
            "ERC20: transfer amount exceeds balance"
        );

        if (_to != msg.sender) {
            balances[msg.sender] = senderBalance - _value;
            balances[_to] += _value; // SafeMath 不再需要，因为Solidity 0.8.0+有内置的溢出检查
            emit Transfer(msg.sender, _to, _value);
        }

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_to != address(0), "ERC20: transferFrom to the zero address");
        require(
            _value > 0,
            "ERC20: transferFrom amount must be greater than zero"
        );
        require(
            balances[_from] >= _value,
            "ERC20: transfer amount exceeds balance"
        );
        require(
            allowances[_from][msg.sender] >= _value,
            "ERC20: transfer amount exceeds allowance"
        );

        balances[_from] -= _value;
        balances[_to] += _value;
        allowances[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        address owner = msg.sender; // 将交易发起者的地址设置为owner
        // 需要首先判断交易发起者不是0地址
        require(owner != address(0), "ERC20: approve from the zero address");
        // 被授权的人也不应该是0地址
        require(_spender != address(0), "ERC20: approve to the zero address");
        allowances[owner][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(
        address _owner,
        address _spender
    ) public view returns (uint256 remaining) {
        require(_owner != address(0), "ERC20: owner is the zero address");
        require(_spender != address(0), "ERC20: spender is the zero address");
        return allowances[_owner][_spender];
    }
}
