const path = require ('path');

module.exports = {
    mode: 'development',
    entry: './source/main.js',
    output: {
        filename: 'o3dv.min.js',
        path: path.resolve ('build'),
        library: 'OV'
    },
};
