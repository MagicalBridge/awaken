// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC1363Receiver.sol";

contract LouisToken is ERC20 {
    constructor() ERC20("LouisToken", "LT") {}

    // transfer failed
    error ERC1363TransferFailed(address to, uint256 value);

    error ERC1363ReceiveFailed(address to);

    // this token allow every body mint
    function mint() external {
        _mint(msg.sender, 10 ** 9);
    }

    function transferAndcall(
        address to,
        uint256 value,
        bytes calldata data
    ) public returns (bool) {
        if (!transfer(to, value)) {
            revert ERC1363TransferFailed(to, value);
        }

        _checkOnTransferReceived(msg.sender, to, value, data);

        return true;
    }

    // hooks
    function _checkOnTransferReceived(
        address from,
        address to,
        uint256 value,
        bytes memory data
    ) private {
        if (isContract(to) == false) {
            return;
        }

        // invoke hook
        try
            IERC1363Receiver(to).onTransferReceived(
                msg.sender,
                from,
                value,
                data
            )
        returns (bytes4 retval) {
            if (retval != IERC1363Receiver.onTransferReceived.selector) {
                revert ERC1363ReceiveFailed(to);
            }
        } catch (bytes memory reason) {
            revert ERC1363ReceiveFailed(to);
        }
    }

    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        // size > 0 is a contract address
        return size > 0;
    }
}
