const mongoose = require("./index")

const PackageListSchema = new mongoose.Schema({
  register: String,
  packageName: String,
  packageVersion: Number,
  entryPointPath: Array,
  description: String,
})

module.exports = mongoose.model(
  "WpmPackageList",
  PackageListSchema,
  "wpmPackageList"
)
