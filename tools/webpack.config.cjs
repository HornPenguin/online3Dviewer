const path = require ('path');

module.exports = [
    {
        name: 'engine_dev',
        mode: 'development',
        entry: './source/main.js',
        target: 'web',
        output: {
            filename: 'o3dv.min.js',
            path: path.resolve ('build', 'dev'),
            library: 'OV'
        }
    },
    {
        name: 'engine_prod',
        mode: 'production',
        entry: './source/main.js',
        target: 'web',
        output: {
            filename: 'o3dv.min.js',
            path: path.resolve ('build', 'prod'),
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
            path: path.resolve ('build', 'dev'),
            library: 'OV'
        }
    },
    {
        name: 'website_prod',
        mode: 'production',
        entry: './website/o3dv/js/index.js',
        target: 'web',
        output: {
            filename: 'o3dv.website.min.js',
            path: path.resolve ('build', 'prod'),
            library: 'OV'
        }
    }
];
