/* eslint-disable prettier/prettier */
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      // '/api': {
      //   target: 'http://182.92.168.192:8081',
      //   pathRewrite: {},
      //   headers: {
      //     authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjY2LCJ1c2VybmFtZSI6IjE4OTU4ODQ5NzUyIiwicGFzc3dvcmQiOiI0YjdjNzhiMzAxYjYxYTMzYmM5ZTI1MWMyYWVhMWU0MSIsInBob25lTnVtYmVyIjoiMTg5NTg4NDk3NTIiLCJuaWNrTmFtZSI6IuS5kOmrmDk3NTIiLCJnZW5kZXIiOjAsInBpY3R1cmUiOm51bGwsImNpdHkiOm51bGwsImxhdGVzdExvZ2luQXQiOiIyMDIyLTA2LTA4VDA5OjQyOjA5LjAwMFoiLCJpc0Zyb3plbiI6ZmFsc2UsImNyZWF0ZWRBdCI6IjIwMjItMDYtMDhUMDk6NDI6MDkuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDYtMDhUMDk6NDI6MDkuMDAwWiIsImlhdCI6MTY1NDY4MTY4NiwiZXhwIjoxNjU0NzY4MDg2fQ.fUfYVoRSJqkp2IDtG2NJgN3YcObCPDe_4vEY1EEJ1uo'
      //   }
      // },
      // '/api': {
      //   target: 'https://jsonplaceholder.typicode.com',
      //   pathRewrite: { '^/api2': '' },
      //   origin: 'https://element-plus.gitee.io'
      // },
      '/api': {
        target: 'http://127.0.0.1:7001',
        pathRewrite: { '^/api': '' },
        secure: true
      }
    }
  }
});
