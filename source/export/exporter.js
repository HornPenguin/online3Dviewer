import { Exporter3dm } from "./exporter3dm";
import { ExporterGltf } from "./exportergltf";
import { ExporterModel } from "./exportermodel";
import { ExporterObj } from "./exporterobj";
import { ExporterOff } from "./exporteroff";
import { ExporterPly } from "./exporterply";
import { ExporterStl } from "./exporterstl";

export class Exporter
{
    constructor ()
    {
        this.exporters = [
            new ExporterObj (),
            new ExporterStl (),
            new ExporterPly (),
            new ExporterOff (),
            new ExporterGltf (),
            new Exporter3dm ()
        ];
    }

    AddExporter (exporter)
    {
        this.exporters.push (exporter);
    }

    Export (model, settings, format, extension, callbacks)
    {
        let exporter = null;
        for (let i = 0; i < this.exporters.length; i++) {
            let currentExporter = this.exporters[i];
            if (currentExporter.CanExport (format, extension)) {
                exporter = currentExporter;
                break;
            }
        }
        if (exporter === null) {
            callbacks.onError ();
            return;
        }

        let exporterModel = new ExporterModel (model, settings);
        exporter.Export (exporterModel, format, (files) => {
            if (files.length === 0) {
                callbacks.onError ();
            } else {
                callbacks.onSuccess (files);
            }
        });
    }
};
