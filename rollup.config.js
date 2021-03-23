import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'

const isProd = process.env.NODE_ENV === 'production'
const { moduleName, dependencies = {}, peerDependencies = {} } = require('./package.json')

const formats = ['umd', 'es']

const configure = {
    input: 'src/index.ts',
    output: formats.map(format => ({
        name: moduleName,
        format,
        sourcemap: true,
        file: destName(`fanyi`, format),
        globals: {
            axios: 'Axios',
            'crypto-js': 'CryptoJS',
        },
    })),
    plugins: [
        typescript(),
        commonjs(),
        nodeResolve(),
    ],
    external: [
        ...Object.keys(dependencies),
        ...Object.keys(peerDependencies),
    ],
}

if (isProd) {
    configure.output = configure.output.map(output => {
        output.file = destName('fanyi', output.format, true)
        return output
    })
    configure.plugins.push(terser())
}

function destName(name = '', format = '', minify = false) {
    return `dist/${name}${format == 'umd' ? '' : `.${format}`}${minify ? '.min' : ''}.js`
}

export default configure
