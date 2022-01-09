import * as fs from 'fs';

import core_test from './tests/core_test.js';
import taskrunner_test from './tests/taskrunner_test.js';
import fileutils_test from './tests/fileutils_test.js';
import io_test from './tests/io_test.js';
import geometry_test from './tests/geometry_test.js';
import meshbuffer_test from './tests/meshbuffer_test.js';
import mesh_test from './tests/mesh_test.js';
import modelutils_test from './tests/modelutils_test.js';
import node_test from './tests/node_test.js';
import model_test from './tests/model_test.js';
import quantities_test from './tests/quantities_test.js';
import generator_test from './tests/generator_test.js';
import importerutils_test from './tests/importerutils_test.js';
import importer3ds_test from './tests/importer3ds_test.js';
// import importergltf_test from './tests/importergltf_test.js';
// import importero3dv_test from './tests/importero3dv_test.js';
// import importerobj_test from './tests/importerobj_test.js';
// import importeroff_test from './tests/importeroff_test.js';
// import importerply_test from './tests/importerply_test.js';
// import importerstl_test from './tests/importerstl_test.js';
// import importer_test from './tests/importer_test.js';
// import exportermodel_test from './tests/exportermodel_test.js';
// import exporter_test from './tests/exporter_test.js';
// import exportimport_test from './tests/exportimport_test.js';
import property_test from './tests/property_test.js';
import parameterlist_test from './tests/parameterlist_test.js';

core_test ();
taskrunner_test ();
fileutils_test ();
io_test ();
geometry_test ();
meshbuffer_test ();
mesh_test ();
modelutils_test ();
node_test ();
model_test ();
quantities_test ();
generator_test ();
importerutils_test ();
importer3ds_test ();
// importergltf_test ();
// importero3dv_test ();
// importerobj_test ();
// importeroff_test ();
// importerply_test ();
// importerstl_test ();
// importer_test ();
// exportermodel_test ();
// exporter_test ();
// exportimport_test ();
property_test ();
parameterlist_test ();

//process.chdir (__dirname);
//require ('./utils/globals.js');

//ExternalLibLocation = '../../libs';

// var testDirName = './tests/';
// var files = fs.readdirSync (testDirName, { withFileTypes: true });
// var i, file;
// for (i = 0; i < files.length; i++) {
//     file = files[i];
//     if (file.isFile ()) {
//         //require (testDirName + file.name);
//     }
// }
