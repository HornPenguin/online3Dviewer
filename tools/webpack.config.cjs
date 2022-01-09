const path = require ('path');

module.exports = [
    {
        name: 'engine_dev',
        mode: 'development',
        entry: './source/main.js',
        output: {
            filename: 'o3dv.min.js',
            path: path.resolve ('build'),
            library: 'OV'
        }
    },
    {
        name: 'engine_prod',
        mode: 'production',
        entry: './source/main.js',
        output: {
            filename: 'o3dv.min.js',
            path: path.resolve ('build'),
            library: 'OV'
        }
    },
    {
        name: 'website_dev',
        mode: 'development',
        entry: './website/o3dv/js/index.js',
        target: 'web',
        output: {
            filename: 'o3dv.website.min.js',
            path: path.resolve ('build')
        }
    }
];
