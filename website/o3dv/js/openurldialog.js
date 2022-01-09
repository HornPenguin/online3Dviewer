import { AddDiv } from "../../../source/viewer/domutils";
import { ButtonDialog } from "./modal";

export function ShowOpenUrlDialog (onOk)
{
    let dialog = new ButtonDialog ();
    let urlsTextArea = OV.CreateDomElement ('textarea', 'ov_dialog_textarea');
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
                OV.ReadLines (urlsTextArea.value, (line) => {
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
};
