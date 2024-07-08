// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenBank {
    mapping(address => mapping(address => uint256)) private balances;

    function deposit(address token, uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        balances[token][msg.sender] += amount;
    }

    function withdraw(address token, uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        require(balances[token][msg.sender] >= amount, "Insufficient balance");
        balances[token][msg.sender] -= amount;
        require(IERC20(token).transfer(msg.sender, amount), "Transfer failed");
    }

    function balanceOf(
        address token,
        address account
    ) public view returns (uint256) {
        return balances[token][account];
    }
}
