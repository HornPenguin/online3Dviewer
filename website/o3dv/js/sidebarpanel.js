import { AddDiv, ClearDomElement } from "../../../source/viewer/domutils";
import { Panel } from "./panelset";

export class SidebarPanel extends Panel
{
    constructor (parentDiv)
    {
        super (parentDiv);
        this.callbacks = null;

        this.titleDiv = AddDiv (this.panelDiv, 'ov_sidebar_title');
        this.contentDiv = AddDiv (this.panelDiv, 'ov_sidebar_content ov_thin_scrollbar');

        let panelName = this.GetName ();
        AddDiv (this.titleDiv, 'ov_sidebar_title_text', this.GetName ());
        this.titleDiv.setAttribute ('title', panelName);
    }

    GetName ()
    {
        return null;
    }

    Clear ()
    {
        ClearDomElement (this.contentDiv);
    }

    Init (callbacks)
    {
        this.callbacks = callbacks;
    }
};
