const UserModel = require("./model/user")
// const WpmPackageListModel = require("./model/wpmPackage")
const mongoose = require("mongoose")

// 手动创建10条数据
let arr = []
for (let i = 0; i < 10; i++) {
  arr.push({ username: "zs" + i, password: "abc" + i, age: i, gender: 0 })
}

;(async () => {
  /**
   * 增加数据
   * */
  //   let users = await UserModel.create(arr)

  /**
   * 查询 find：查询所有  findById：查询一个
   * 条件查询 并且的情况  或的情况 范围的情况
   *
   **/
  //   let users = await UserModel.find(
  //     {
  //       username: "zs4",
  //       password: "abc4",
  //     },
  //     { age: 1, gender: 1, _id: 0 }
  //   ) // username password age gender  age说我要显示其他的要隐藏，gender除了我要隐藏外其他的都要显示
  //   console.log(users)

  /**
   * 或者的关系，使用 $or 关键字，传递的是一个数组
   * 数组中存放的是平行的条件
   */
  //   let users = await UserModel.find(
  //     {
  //       $or: [{ username: "zs1" }, { username: "zs4" }],
  //     },
  //     { age: 1, gender: 1, _id: 0 }
  //   )
  //   console.log(users)

  /**
   * 或者的关系，使用 $lg $gt 关键字，代表的对于某些条件的范围
   */
  //   let users = await UserModel.find(
  //     {
  //       age: { $lte: 4 },
  //     },
  //     { age: 1, gender: 1, _id: 0 }
  //   )
  //   console.log(users)

  /**
   * 分页查询
   */
  //   const limit = 3 // 每页显示3条
  //   const currentPage = 2 // 当前页数2
  // 个数 限制个数 跳过个数 排序  (这些方法 在调用的时候 没有顺序问题)
  // 执行顺序 是在所有中 先查找  先跳过 在限制显示
  // let users = await UserModel.find({}).skip((currentPage - 1) * limit).limit(limit).sort({age:-1})

  // 以前的api叫 update 现在更新一个叫updateOne  更新多个叫updateMany

  // 默认可以追加新的字段
  // let doc = await UserModel.updateOne({username:'111'},{username:'xxx'},{upsert:true})
  // console.log(doc)

  // let r = await UserModel.deleteOne({username:'xxx'})
  // console.log(r)
  mongoose.disconnect()
})()
