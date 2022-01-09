const path = require('path');

module.exports = {
    mode: 'development',
    entry: './tools/engine_main.js',
    output: {
        filename: 'o3dv.min.js',
        path: path.resolve (__dirname, '..', 'build'),
        library: 'OV'
    },
};
