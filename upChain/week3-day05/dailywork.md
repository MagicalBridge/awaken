# 部署并开源 NFTMarket 合约：

使⽤ TheGraph 索引 NFTMarket 的上架 List 和成交 Sold 记录；

将作业提交到 https://decert.me/challenge/ebb2c893-d671-41c5-a699-51d1d1634b87

对应的结构体信息：

```sql
type OrderBook @entity(immutable: true) { 
  id: Bytes! 
  nft: Bytes! # address 
  tokenId: BigInt! # uint256 
  seller: Bytes! # address 
  payToken: Bytes! # address 
  price: BigInt! # uint256 
  deadline: BigInt! # uint256 
  blockNumber: BigInt! 
  blockTimestamp: BigInt! 
  transactionHash: Bytes! 
  cancelTxHash: Bytes! 
  filledTxHash: Bytes! 
} 

type FilledOrder @entity(immutable: true) { 
  id: Bytes! 
  buyer: Bytes! # address 
  fee: BigInt! # uint256 
  blockNumber: BigInt! 
  blockTimestamp: BigInt! 
  transactionHash: Bytes! 
  # relation 
  order: OrderBook 
}
```




