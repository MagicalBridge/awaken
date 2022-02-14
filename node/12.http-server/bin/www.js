#! /usr/bin/env node


// 这里需要有一个帮助文档 命令行的帮助文档
const program = require('commander');
const options = require('./config');
program.name('fs')
program.usage('[options]')

// 解析 当前运行进程传递的参数

const examples = new Set();
const defaultMapping = {};
Object.entries(options).forEach(([key,value])=>{
    examples.add(value.usage)
    defaultMapping[key] = value.default;
    program.option(value.option,value.description)
})

program.on('--help',function () {
    console.log('\nExamples:')
    examples.forEach(item=>{
        console.log(`  ${item}`)
    })
})

program.parse(process.argv);
let userArgs = program.opts();
// 合并最终的参数 需要启动一个服务
let serverOptions = Object.assign(defaultMapping,userArgs)

// 启动一个服务
const Server = require('../src/index');
let server = new Server(serverOptions);
server.start()
