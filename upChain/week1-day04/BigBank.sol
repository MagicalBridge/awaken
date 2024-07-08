// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Define IBank interface
interface IBank {
    // Event definitions
    event Withdrawal(address indexed to, uint256 amount);
    event Deposit(address indexed from, uint256 amount);

    // Function definitions to be implemented
    // Getter function for public state variable
    function owner() external view returns (address);

    // Deposit function
    function deposit() external payable;

    // Withdraw function
    function withdraw(uint256 amount) external;

    // Get balance for a specific address
    function getBalance(address addr) external view returns (uint256);

    // Get top depositors
    function getTopDepositors() external view returns (address[] memory);
}

// Define IBigBank interface
interface IBigBank {
    function withdraw(uint256 amount) external;
}

// OriginalBank contract implementing IBank interface
contract OriginalBank is IBank {
    address public owner;
    mapping(address => uint256) private balances;
    address[] public topDepositors;

    // Constructor to set the contract owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict function access to owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Fallback function to handle direct ETH transfers
    receive() external payable {
        deposit();
    }

    // Deposit function to add funds to the contract
    function deposit() public payable virtual override {
        balances[msg.sender] += msg.value;
        updateTopDepositors(msg.sender);
        emit Deposit(msg.sender, msg.value);
    }

    // Withdraw function to transfer funds to the owner
    function withdraw(uint256 amount) public override onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Contract balance is zero");
        require(amount <= balance, "Insufficient contract balance");
        payable(owner).transfer(amount);
        emit Withdrawal(owner, amount);
    }

    // Internal function to update the list of top depositors
    function updateTopDepositors(address depositor) internal {
        bool exists = false;
        for (uint256 i = 0; i < topDepositors.length; i++) {
            if (topDepositors[i] == depositor) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            topDepositors.push(depositor);
        }

        // Sort depositors based on their balance
        for (uint256 i = 0; i < topDepositors.length; i++) {
            for (uint256 j = i + 1; j < topDepositors.length; j++) {
                if (balances[topDepositors[i]] < balances[topDepositors[j]]) {
                    address temp = topDepositors[i];
                    topDepositors[i] = topDepositors[j];
                    topDepositors[j] = temp;
                }
            }
        }

        // Keep only the top 3 depositors
        if (topDepositors.length > 3) {
            topDepositors.pop();
        }
    }

    // Get balance for a specific address
    function getBalance(address addr) public view override returns (uint256) {
        return balances[addr];
    }

    // Get the list of top depositors
    function getTopDepositors()
        public
        view
        override
        returns (address[] memory)
    {
        return topDepositors;
    }
}

// BigBank contract inheriting from OriginalBank
contract BigBank is OriginalBank {
    // Define minimum deposit amount
    uint256 private constant MIN_DEPOSIT = 1_000_000_000_000_000; // 0.001 ETH in wei

    // Event for ownership transfer
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // Modifier to check if deposit amount is greater than minimum required
    modifier minDepositRequired() {
        require(msg.value > MIN_DEPOSIT, "Deposit must be greater 0.001 ether");
        _;
    }

    // Override deposit function with minDepositRequired modifier
    function deposit() public payable override minDepositRequired {
        super.deposit();
    }

    // Function to transfer ownership to a new address
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        require(newOwner != owner, "New owner cannot be the current owner");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// Ownable contract to manage ownership and interact with BigBank
contract Ownable {
    address public owner; // Owner's address

    IBigBank public bigBank;

    // Constructor to set the initial owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict function access to owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    // Function to set the BigBank contract address
    function setBigBankAddress(address _bigBankAddress) public onlyOwner {
        bigBank = IBigBank(_bigBankAddress);
    }

    // Function to withdraw from BigBank
    function withdraw(uint256 amount) public onlyOwner {
        require(address(bigBank) != address(0), "BigBank address not set");
        bigBank.withdraw(amount);
    }

    // Fallback function to receive ETH
    receive() external payable {}
}
