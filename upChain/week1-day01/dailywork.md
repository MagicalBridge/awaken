# 实践POW与非对称加密

## 题目1：

实践 POW， 编写程序（编程语言不限）用自己的昵称 + nonce，不断修改nonce进行 sha256 Hash 运算：
1、直到满足 4 个 0 开头的哈希值，打印出花费的时间、Hash 的内容及Hash值。
2、再次运算直到满足 5 个 0 开头的哈希值，打印出花费的时间、Hash的内容及Hash值。

### 关键知识点：
1、nonce 如果可以自增的话，类型为number，我的昵称是字符串类型，如果需要将两部分进行拼接，需要将number类型转换为string类型，然后将两部分的字符串都转成buffer，再进行sha256的hash运算。

### 相关实现：
https://github.com/MagicalBridge/awaken/blob/master/upChain/day01/JavaScript/work-02.js

