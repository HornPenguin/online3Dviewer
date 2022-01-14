import { Coord2D } from '../geometry/coord2d.js';
import { Coord3D } from '../geometry/coord3d.js';
import { Direction } from '../geometry/geometry.js';
import { LoadExternalLibrary } from '../io/externallibs.js';
import { ColorFromFloatComponents } from '../model/color.js';
import { PhongMaterial, TextureMap } from '../model/material.js';
import { Mesh } from '../model/mesh.js';
import { Triangle } from '../model/triangle.js';
import { ImporterBase } from './importerbase.js';

export class ImporterBlend extends ImporterBase
{
    constructor ()
    {
        super ();
		this.jsblend = null;
    }

    CanImportExtension (extension)
    {
        return extension === 'blend';
    }

    GetUpDirection ()
    {
        return Direction.Z;
    }

	ClearContent ()
	{

	}

    ResetContent ()
    {

    }

    ImportContent (fileContent, onFinish)
    {
		if (this.jsblend === null) {
			LoadExternalLibrary ('loaders/jsblend.js').then (() => {
				this.jsblend = jsblend ();
                this.ImportBlenderFile (fileContent, onFinish);
            }).catch (() => {
                onFinish ();
            });
		} else {
			this.ImportBlenderFile (fileContent, onFinish);
		}
    }

	ImportBlenderFile (fileContent, onFinish)
	{
        this.jsblend.onParseReady = (blenderFile, error) => {
            // TODO: error
            this.ImportBlenderContent (blenderFile);
            onFinish ();
        };
        this.jsblend.loadBlendFromBlob (new Blob ([fileContent]), null);
	}

    ImportBlenderContent (blenderContent)
    {
        function ConvertTexture (material, blenderTexture, callbacks)
        {
            if (!blenderTexture || !blenderTexture.tex || !blenderTexture.tex.ima) {
                return;
            }
            let ima = blenderTexture.tex.ima;
            if (ima.packedfile) {
                // TODO
                return;
            }
            let texture = new TextureMap ();
            let textureBuffer = callbacks.getTextureBuffer (ima.aname);
            texture.name = ima.aname;
            if (textureBuffer !== null) {
                texture.url = textureBuffer.url;
                texture.buffer = textureBuffer.buffer;
            }
            if (blenderTexture.mapto & 1) { // diffuse
                material.diffuseMap = texture;
                material.multiplyDiffuseMap = true;
            }
        }

        function ConvertMaterial (blenderMaterial, callbacks)
        {
            let material = new PhongMaterial ();
            material.name = blenderMaterial.id.name;
            material.color = ColorFromFloatComponents (blenderMaterial.r, blenderMaterial.g, blenderMaterial.b);
            material.specular = ColorFromFloatComponents (blenderMaterial.specr, blenderMaterial.specg, blenderMaterial.specb);
            material.shininess = blenderMaterial.har / 51200.0;
            if (blenderMaterial.mtex && blenderMaterial.mtex.length > 0) {
                for (let actBlenderMaterial of blenderMaterial.mtex) {
                    ConvertTexture (material, actBlenderMaterial, callbacks);
                }
            }
            return material;
        }

        function AddPoly (mesh, loops, poly, hasUVs, meshToModelMaterial)
        {
            let vertexCount = poly.totloop;
            let loopStart = poly.loopstart;
            for (let i = 0; i < vertexCount - 2; i++) {
                let v0 = loops[loopStart].v;
                let v1 = loops[loopStart + i + 1].v;
                let v2 = loops[loopStart + i + 2].v;
                let triangle = new Triangle (v0, v1, v2);
                triangle.SetNormals (v0, v1, v2);
                if (hasUVs) {
                    triangle.SetTextureUVs (
                        loopStart,
                        loopStart + i + 1,
                        loopStart + i + 2
                    );
                }
                if (meshToModelMaterial.has (poly.mat_nr)) {
                    triangle.SetMaterial (meshToModelMaterial.get (poly.mat_nr));
                }
                mesh.AddTriangle (triangle);
            }
        }

        let materialNameToIndex = new Map ();
        for (let blenderMaterial of blenderContent.objects.Material) {
            let material = ConvertMaterial (blenderMaterial, this.callbacks);
            let materialIndex = this.model.AddMaterial (material);
            materialNameToIndex.set (material.name, materialIndex);
        }

        for (let blenderMesh of blenderContent.objects.Mesh) {
            let meshToModelMaterial = new Map ();
            for (let meshMaterialIndex = 0; meshMaterialIndex < blenderMesh.mat.length; meshMaterialIndex++) {
                let blenderMaterial = blenderMesh.mat[meshMaterialIndex];
                meshToModelMaterial.set (meshMaterialIndex, materialNameToIndex.get (blenderMaterial.id.name));
            }

            // TODO: vertex colors
            let verts = blenderMesh.mvert;
            let uvs = blenderMesh.mloopuv;
            let polys = blenderMesh.mpoly;
            let loops = blenderMesh.mloop;

            console.log (verts);

            if (!verts || !polys || !loops) {
                continue;
            }

            let mesh = new Mesh ();
            mesh.SetName (blenderMesh.id.name);

            for (let vert of verts) {
                mesh.AddVertex (new Coord3D (vert.co[0], vert.co[1], vert.co[2]));
                mesh.AddNormal (new Coord3D (vert.no[0], vert.no[1], vert.no[2]).Normalize ());
            }

            let hasUVs = false;
            if (uvs) {
                hasUVs = true;
                for (let uv of uvs) {
                   mesh.AddTextureUV (new Coord2D (uv.uv[0], uv.uv[1]));
                }
            }

            if (Array.isArray (polys)) {
                for (let poly of polys) {
                    AddPoly (mesh, loops, poly, hasUVs, meshToModelMaterial);
                }
            } else {
                AddPoly (mesh, loops, polys, hasUVs, meshToModelMaterial);
            }

            this.model.AddMeshToRootNode (mesh);
        }
    }
}
