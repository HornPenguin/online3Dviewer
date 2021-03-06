import { Color } from '../engine/model/color.js';
import { CookieGetBoolVal, CookieGetColorVal, CookieGetIntVal, CookieSetBoolVal, CookieSetColorVal, CookieSetIntVal } from './cookiehandler.js';

export const Theme =
{
    Light : 1,
    Dark : 2
};

export class Settings
{
    constructor ()
    {
        this.backgroundColor = new Color (255, 255, 255);
        this.defaultColor = new Color (200, 200, 200);
        this.showGrid = false;
        this.showEdges = false;
        this.edgeColor = new Color (0, 0, 0);
        this.edgeThreshold = 1;
        this.themeId = Theme.Light;
    }

    LoadFromCookies ()
    {
        this.backgroundColor = CookieGetColorVal ('ov_background_color', new Color (255, 255, 255));
        this.defaultColor = CookieGetColorVal ('ov_default_color', new Color (200, 200, 200));
        this.showGrid = CookieGetBoolVal ('ov_show_grid', false);
        this.showEdges = CookieGetBoolVal ('ov_show_edges', false);
        this.edgeColor = CookieGetColorVal ('ov_edge_color', new Color (0, 0, 0));
        this.edgeThreshold = CookieGetIntVal ('ov_edge_threshold', 1);
        this.themeId = CookieGetIntVal ('ov_theme_id', Theme.Light);
    }

    SaveToCookies ()
    {
        CookieSetColorVal ('ov_background_color', this.backgroundColor);
        CookieSetColorVal ('ov_default_color', this.defaultColor);
        CookieSetBoolVal ('ov_show_grid', this.showGrid);
        CookieSetBoolVal ('ov_show_edges', this.showEdges);
        CookieSetColorVal ('ov_edge_color', this.edgeColor);
        CookieSetIntVal ('ov_edge_threshold', this.edgeThreshold);
        CookieSetIntVal ('ov_theme_id', this.themeId);
    }
}
