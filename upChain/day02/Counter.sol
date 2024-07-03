// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint public counter = 0;

    constructor(uint _counter) {
        counter = _counter;
    }

    // 声明 getCounter 是view可视范围，返回最新的状态变量的值
    function  get () public  view returns(uint) {
        return counter;
    }

    // 参数要求是uint类型
    function add (uint x) external returns(uint) {
        return counter += x;
    }
}