// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC1363Receiver.sol";

/**
 * @title TokenBank
 * @dev A smart contract that allows users to deposit and withdraw ERC20 tokens.
 */
contract TokenBank {
    /// @dev A mapping to store balances for each token address and user address.
    mapping(address => mapping(address => uint256)) private balances;

    /**
     * @dev Deposits a specified amount of ERC20 tokens from the caller's address to the contract.
     * @param token The address of the ERC20 token to deposit.
     * @param amount The amount of tokens to deposit.
     *
     * Emits an event if the deposit is successful.
     *
     * Requirements:
     * - `amount` must be greater than zero.
     * - The transfer from the caller to the contract must be successful.
     */
    function deposit(address token, uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        balances[token][msg.sender] += amount;

        // Emit an event for successful deposits (optional)
        // emit Deposit(msg.sender, token, amount);
    }

    /**
     * @dev Withdraws a specified amount of ERC20 tokens from the contract to the caller's address.
     * @param token The address of the ERC20 token to withdraw.
     * @param amount The amount of tokens to withdraw.
     *
     * Emits an event if the withdrawal is successful.
     *
     * Requirements:
     * - `amount` must be greater than zero.
     * - The caller must have sufficient balance of the specified token.
     * - The transfer from the contract to the caller must be successful.
     */
    function withdraw(address token, uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        require(balances[token][msg.sender] >= amount, "Insufficient balance");
        balances[token][msg.sender] -= amount;
        require(IERC20(token).transfer(msg.sender, amount), "Transfer failed");

        // Emit an event for successful withdrawals (optional)
        // emit Withdrawal(msg.sender, token, amount);
    }

    /**
     * @dev Returns the balance of a specific ERC20 token for a given user.
     * @param token The address of the ERC20 token.
     * @param account The address of the user.
     * @return The balance of the specified token for the user.
     */
    function balanceOf(
        address token,
        address account
    ) public view returns (uint256) {
        return balances[token][account];
    }

    function onTransferReceived(
        address operator,
        address from,
        uint256 amount,
        bytes memory data
    ) external returns (bytes4) {
        require(amount > 0, "Amount must be greater than 0");
        balances[msg.sender][from] += amount;
        return IERC1363Receiver.onTransferReceived.selector;
    }
}
