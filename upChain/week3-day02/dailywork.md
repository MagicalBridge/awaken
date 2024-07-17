# 使用 EIP712 进行链下 Permit 和 白名单设计

## 题目1：
- 1.使用`EIP2612`标准（可基于 Openzepplin 库）编写一个自己名称的 Token 合约。
- 2.修改`TokenBank`存款合约, 添加一个函数`permitDeposit`以支持离线签名授权（permit）进行存款。
- 3.修改Token 购买 NFT NTFMarket 合约，添加功能 permitBuy() 实现只有离线授权的白名单地址才可以购买 NFT （用自己的名称发行 NFT，再上架） 。白名单具体实现逻辑为：项目方给白名单地址签名，白名单用户拿到签名信息后，传给 permitBuy() 函数，在permitBuy()中判断时候是经过许可的白名单用户，如果是，才可以进行后续购买，否则 revert 。

要求：
- 1.有 Token 存款及 NFT 购买成功的测试用例
- 2.有测试用例运行日志或截图，能够看到 Token 及 NFT 转移。

请填写你的 Github 项目链接地址。

### 题解思路：

1、今天主要讲了ERC191，我正在梳理这部分的内容, 这个提议，主要确定了，相关的签名标准。把这部分的内容梳理一下。

2、学习ERC712的规范的相关内容

3、学习EIP2612相关的实现。

4、基于openzepplin的库，实现一个Token，首先将这个token部署到测试链上。' 0x3c510705cdbb9c2d8c6A68A44256fb331D1EDB56 '

5、查看一些Token的基本属性。基本属性都没有问题

6、部署TokenBank合约, ' 0xBc1B2EdE79abCD81571724446389FAb29E3d6ACc '

7、部署这两个合约，使用的都是我的同一个地址：' 0x2b754dEF498d4B6ADada538F01727Ddf67D91A7D '

8、接下来开始实现前端代码，整体的逻辑是：构造 domain、构造types、构造value然后用户前端进行离线签名，得到签名之后，可以解析出r、s、v的参数，然后再调用TokenBank合约 的 permitDeposit() 函数，进行存款。这个存款函数是tokenBank合约内部实现的。它会先验证签名是否有效，
 
9、前端授权之后,在tokenbank 中可以查询到，用户授权的这个erc20 的 数量 是 10000000000000000000 

10、整体交互完毕。


### 关于NFT的题解思路：

1. 修改 TokenBank 存款合约 ,添加⼀个函数 permitDeposit 以⽀持离线签名授权（permit）进⾏存款。 

    function permitDeposit()  EIP2612

3. 修改Token 购买 NFT NTFMarket 合约，添加功能 permitBuy() 实现只有离线授权的⽩名单地址才可以购买 NFT （⽤⾃⼰的名称发
⾏ NFT，再上架） 。⽩名单具体实现逻辑为：项⽬⽅给⽩名单地址签名，⽩名单⽤户拿到签名信息后，传给 permitBuy() 函数，在
permitBuy()中判断时候是经过许可的⽩名单⽤户，如果是，才可以进⾏后续购买，否则 revert 。

```js
function permitBuy(signature){
  // check  signer == owner // hash(...) == EIP712
  // erc20.trasnferFrom(...)

}

function permitBuy(signatureEIP712,signatureEIP2612){
  // check  signer == owner // hash(...) == EIP712
  erc20.permit(signatureEIP2612)
}
```


```js
onchain: list(nft,tokenId,price)

offchain: sell: EIP712(sellOrder(seller,nft,tokenId,price,deadline)) => signatureForSellOrder
 
// 买家可以直接买入NFT
// 在买入时，买家只需要拿到卖家订单的离线签名（由平台中心化管理 opensea）
buy(SellOrder order,signatureForSellOrder,signatureForApprove , signatureForWL){
    ; check signatureForWL
    require(getSigner(hashStruct(Message{msg.sender}),signatureForWL)==owner,"invalid signature");
    
    // check sell order is valid, EIP712
    bytes32 orderHash = hashStruct(order);
    require(getSigner(orderHash, signatureForSellOrder) == order.seller, "invalid signature");
    require(orders[orderHash] != "filled","order sold");
    
    //check
    orders[orderHash] = "filled";

    ; token trasnfer
    address buyer = msg.sender;
    erc20.permit(buyer,address(this), order.price, signatureForApprove) // == approve
    erc20.trasnferFrom(buyer,order.seller, order.price); // 
    ; nft trasnfer
    nft.safeTrasnferFrom(order.seller,buyer,order.tokenId) 
}
```

1、我的理解是签名的行为是一个用户主动的行为，比如说，题目中的tokenBank，需要前端在链下按照结构化的数据进行签名，签名之后，解构出来 rsv 参数，这个时候再由用户主动调用 tokenbnak的存款方法，将这些参数传递进去，在合约内部调用ERC2612的 permit 方法来校验签名有效性。通过了之后，才可以将用户的钱转进来。

2、项目方给白名单地址签名：这个行为也应该是用户主动触发的，项目方可以主动的给用户进行签名吗，这个不太理解。

3、这个签名的映射关系，可以存储在NFT合约中吗？比如在前端界面上有一个申请购买的按钮，这个时候，用户进行链下签名之后把这个数据存储在NFT合约中。但是这样是需要支付GAS, 或者是购买的用户使用中心化的方式，将自己的签名信息发送到中心化服务器上，在后端做一个存储映射，地址对应签名信息。

4、用户在真实购买的时候，前端请求接口从中心化的服务中取出用户的签名信息，然后传递给buypert函数，这个函数内部对这个签名信息做解析判断是否有效。有效的话调用 ERC2612的 permit 方法进行验证。

5、在讨论中至少明白一件事情：白名单可以项目方在事先就设计好的东西。用户实际上就是拿着这个信息去购买NFT。

