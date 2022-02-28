const mongoose = require("mongoose")
mongoose.connect(
  "mongodb://47.103.72.18:27017/hubble",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) return console.log(err)
    console.log("链接成功")
  }
)
module.exports = mongoose
