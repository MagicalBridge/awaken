// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bank {
    // State variable owner, the owner of the contract
    address public owner;
    // Declare a mapping, address type -> account balance, internal access within the contract
    mapping (address => uint256) private balances;
    // An array to store the users with the highest deposits
    address[] public topDepositors;

    // Declare an event triggered on withdrawal
    event Withdrawal(address indexed to, uint256 amount);
    // Declare an event triggered on deposit
    event Deposit(address indexed from, uint256 amount);

    constructor() {
        // In the constructor, set the owner to msg.sender, setting the deployer as the contract owner
        owner = msg.sender;
    }

    // Access control, only the contract owner can execute certain operations
    modifier onlyOwner () {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Declare receive callback function, allowing the contract to receive native currency
    receive() external payable {
        // When someone sends Ether to the contract, directly call the deposit function
        deposit();
    }

    // Deposit function, allowing external accounts to deposit Ether into the contract
    function deposit() public payable {
        // The amount of native currency sent by the user must be greater than 0
        require(msg.value > 0, "Deposit amount must be greater than zero");
        // Update the balance of each address
        balances[msg.sender] += msg.value;
        // Update the leaderboard
        updateTopDepositors(msg.sender);
        // Trigger the event
        emit Deposit(msg.sender, msg.value);
    }

    // Withdrawal function, only allows the contract owner to withdraw
    function withdraw(uint256 amount) public onlyOwner {
        // Get the current balance of the Bank contract
        uint256 balance = address(this).balance;
        // If the balance is insufficient, withdrawal is not supported
        require(balance > 0, "Contract balance is zero");
        // The amount to be withdrawn should be less than the current balance in the contract
        require(amount <= balance, "Insufficient contract balance");
        // The contract owner can withdraw, the unit is wei, note the conversion of units.
        payable(owner).transfer(amount);
        // Trigger the withdrawal event
        emit Withdrawal(owner, amount);
    }

    // Continuously update the ranking
    function updateTopDepositors(address depositor) internal {
        // Set a flag to avoid duplication
        bool exists = false;

        // Traverse the array, if the current address already exists in topDepositors, exit the loop
        for (uint256 i = 0; i < topDepositors.length; i++) {
            if (topDepositors[i] == depositor) {
                exists = true;
                break;
            }
        }
        // If it does not exist, add the current address to the array
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

        // After the array length exceeds 3, only keep the top three.
        if (topDepositors.length > 3) {
            topDepositors.pop();
        }
    }

    // View the account balance based on the specified address
    function getBalance(address addr) public view returns(uint256) {
        return balances[addr];
    }

    // Return the deposit leaderboard
    function getTopDepositors() public view returns (address[] memory) {
        return topDepositors;
    }
}