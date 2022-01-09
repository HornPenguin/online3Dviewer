const path = require ('path');

module.exports = {
    mode: 'development',
    entry: './website/o3dv/js/index.js',
    target: 'web',
    output: {
        filename: 'o3dv.website.min.js',
        path: path.resolve ('build')
    },
};
