import { ReadLines } from '../../../source/import/importerutils.js';
import { AddDiv, CreateDomElement } from '../../../source/viewer/domutils.js';
import { ButtonDialog } from './modal.js';

export function ShowOpenUrlDialog (onOk)
{
    let dialog = new ButtonDialog ();
    let urlsTextArea = CreateDomElement ('textarea', 'ov_dialog_textarea');
    let contentDiv = dialog.Init ('Open Model from Url', [
        {
            name : 'Cancel',
            subClass : 'outline',
            onClick () {
                dialog.Hide ();
            }
        },
        {
            name : 'OK',
            onClick () {
                let urls = [];
                ReadLines (urlsTextArea.value, (line) => {
                    urls.push (line);
                });
                dialog.Hide ();
                onOk (urls);
            }
        }
    ]);
    let text = 'Here you can load models based on their urls. You can add more lines if your model builds up from multiple files.';
    AddDiv (contentDiv, 'ov_dialog_section', text);
    contentDiv.appendChild (urlsTextArea);
    dialog.Show ();
    urlsTextArea.focus ();
    return dialog;
}
