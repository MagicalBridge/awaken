
const options = {
    'port': {
        option: '-p, --port <n>', // 根据commander 的 option('')
        default: 8080,
        usage: 'fs --port 3000',
        description: 'set fs port'
    },
    'gzip': {
        option: '-g, --gzip <n>',
        default: 1,
        usage: 'fs --gzip 0', // 禁用压缩
        description: 'set fs gzip'
    },
    'cache': {
        option: '-c, --cache <n>',
        default: 1,
        usage: 'fs --cache 0', // 禁用缓存
        description: 'set fs gzip'
    },
    'directory': {
        option: '-d, --directory <d>',
        default: process.cwd(),
        usage: 'fs --directory d:', // 禁用缓存
        description: 'set fs directory'
    }
}

module.exports = options;