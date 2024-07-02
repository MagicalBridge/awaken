const crypto = require("crypto")

/**
 * @param {*} nickName 昵称
 * @param {*} startHash 要求的前导零hash
 * @param {*} endIndex 需要第几个索引不得为0
 * @returns
 */
function calculateTime(nickName, startHash, endIndex) {
  // 声明自己的昵称 string类型的值
  const myNickname = Buffer.from(nickName)

  // 声明nonce值，默认为0
  let nonce = 0
  let hash = null

  // record the start time
  const startTime = Date.now()

  while (true) {
    let dataStr = Buffer.concat([myNickname, Buffer.from(nonce.toString())])
    hash = crypto.createHash("sha256").update(dataStr).digest("hex")

    if (hash.startsWith(startHash) && hash[endIndex] !== "0") {
      break
    }

    nonce++
  }

  // record the end time
  const endTime = Date.now()

  // 计算运行时间（毫秒）
  const runTime = endTime - startTime

  return {
    nonce,
    hash,
    runTime,
  }
}

let { nonce, hash, runTime } = calculateTime("MagicalBridge", "0000", 4)

console.log("nonce", nonce)
console.log("hash", hash)
console.log(`Run Time: ${runTime} ms`)

// nonce 246214
// hash 0000ba567d52e87920d38681989d8b6384ca42954149b5a40cb76fe4b15809ec
// Run Time: 184 ms

let {
  nonce: nonce1,
  hash: hash1,
  runTime: runTime1,
} = calculateTime("MagicalBridge", "00000", 5)

console.log("nonce1", nonce1)
console.log("hash1", hash1)
console.log(`Run Time1: ${runTime1} ms`)

// nonce1 982177
// hash1 0000014ec69544e8cba07a00c8fa4c98c899f981b80066277772a2e79badb4ec
// Run Time1: 672 ms
