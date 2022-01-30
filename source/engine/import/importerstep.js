import { Direction } from '../geometry/geometry.js';
import { LoadExternalLibrary } from '../io/externallibs.js';
import { ConvertThreeGeometryToMesh } from '../threejs/threeutils.js';
import { ImporterBase } from './importerbase.js';

export class ImporterStep extends ImporterBase
{
    constructor ()
    {
        super ();
		this.occt = null;
    }

    CanImportExtension (extension)
    {
        return extension === 'stp' || extension === 'step';
    }

    GetUpDirection ()
    {
        return Direction.Y;
    }

	ClearContent ()
	{

	}

    ResetContent ()
    {

    }

    ImportContent (fileContent, onFinish)
    {
		if (this.occt === null) {
			LoadExternalLibrary ('loaders/occt-import-js.js').then (() => {
				occtimportjs ().then ((occt) => {
					this.occt = occt;
					this.ImportStepContent (fileContent);
					onFinish ();
				});
            }).catch (() => {
                onFinish ();
            });
		} else {
			this.ImportStepContent (fileContent);
			onFinish ();
		}
    }

	ImportStepContent (fileContent)
	{
        let fileBuffer = new Uint8Array (fileContent);
        let result = this.occt.ReadStepFile (fileBuffer);
        if (!result.success) {
            return;
        }
        console.log (result);
        for (let occtMesh of result.meshes) {
            let mesh = ConvertThreeGeometryToMesh (occtMesh, null);
            this.model.AddMeshToRootNode (mesh);
        }
	}
}
