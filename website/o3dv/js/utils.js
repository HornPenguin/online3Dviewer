import { AddDiv } from "../../../source/viewer/domutils";
import { CreateVerticalSplitter } from "./splitter";

OV.GetNameOrDefault = function (originalName, defaultName)
{
    if (originalName.length > 0) {
        return originalName;
    }
    return defaultName;
};

OV.GetNodeName = function (originalName)
{
    return OV.GetNameOrDefault (originalName, 'No Name');
};

OV.GetMeshName = function (originalName)
{
    return OV.GetNameOrDefault (originalName, 'No Name');
};

OV.GetMaterialName = function (originalName)
{
    return OV.GetNameOrDefault (originalName, 'No Name');
};

OV.IsHoverEnabled = function ()
{
    return window.matchMedia ('(hover: hover)').matches;
};

OV.AddSmallWidthChangeEventListener = function (onChange)
{
    let mediaQuery = window.matchMedia ('(max-width: 800px)');
    mediaQuery.addEventListener ('change', onChange);
};

OV.IsSmallWidth = function ()
{
    return window.matchMedia ('(max-width: 800px)').matches;
};

OV.IsSmallHeight = function ()
{
    return window.matchMedia ('(max-height: 800px)').matches;
};

OV.InstallTooltip = function (element, text)
{
    function CalculateOffset (element, tooltip)
    {
        let windowWidth = window.innerWidth;

        let elementOffset = element.getBoundingClientRect ();
        let elementWidth = element.offsetWidth;
        let elementHeight = element.offsetHeight;
        let tooltipWidth = tooltip.offsetWidth;

        let tooltipMargin = 10;
        let left = elementOffset.left + elementWidth / 2 - tooltipWidth / 2;
        if (left + tooltipWidth > windowWidth - tooltipMargin) {
            left = windowWidth - tooltipWidth - tooltipMargin;
        }
        if (left < tooltipMargin) {
            left = tooltipMargin;
        }
        left = Math.max (left, 0);
        return {
            left : left,
            top : elementOffset.top + elementHeight + tooltipMargin
        };
    }

    if (!OV.IsHoverEnabled ()) {
        return;
    }

    let tooltip = null;
    element.addEventListener ('mouseover', () => {
        tooltip = AddDiv (document.body, 'ov_tooltip', text);
        let offset = CalculateOffset (element, tooltip);
        tooltip.style.left = offset.left + 'px';
        tooltip.style.top = offset.top + 'px';
    });
    element.addEventListener ('mouseout', () => {
        tooltip.remove ();
    });
};

OV.CopyToClipboard = function (text)
{
    let input = document.createElement ('input');
    input.style.position = 'absolute';
    input.style.left = '0';
    input.style.top = '0';
    input.setAttribute ('value', text);
    document.body.appendChild (input);
    input.select ();
    document.execCommand ('copy');
    document.body.removeChild (input);
};

OV.DownloadUrlAsFile = function (url, fileName)
{
    let link = document.createElement ('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild (link);
    link.click ();
    document.body.removeChild (link);
};

OV.DownloadArrayBufferAsFile = function (arrayBuffer, fileName)
{
    let url = OV.CreateObjectUrl (arrayBuffer);
    OV.DownloadUrlAsFile (url, fileName);
};

OV.CreateSvgIconElement = function (iconName, className)
{
    let iconDiv = OV.CreateDiv ('ov_svg_icon');
    if (className) {
        iconDiv.classList.add (className);
    }
    OV.AddDomElement (iconDiv, 'i', 'icon icon-' + iconName);
    return iconDiv;
};

OV.AddSvgIconElement = function (parentElement, iconName, className)
{
    let iconDiv = OV.CreateSvgIconElement (iconName, className);
    parentElement.appendChild (iconDiv);
    return iconDiv;
};

OV.SetSvgIconImageElement = function (iconElement, iconName)
{
    let iconDiv = iconElement.firstChild;
    iconDiv.className = 'icon icon-' + iconName;
};

OV.CreateHeaderButton = function (parentElement, iconName, title, link)
{
    let buttonLink = OV.CreateDomElement ('a');
    buttonLink.setAttribute ('href', link);
    buttonLink.setAttribute ('target', '_blank');
    buttonLink.setAttribute ('rel', 'noopener noreferrer');
    OV.InstallTooltip (buttonLink, title);
    OV.AddSvgIconElement (buttonLink, iconName, 'header_button');
    parentElement.appendChild (buttonLink);
    return buttonLink;
};

OV.CreateInlineColorCircle = function (color)
{
    let hexString = '#' + OV.ColorToHexString (color);
    let darkerColor = new OV.Color (
        Math.max (0, color.r - 50),
        Math.max (0, color.g - 50),
        Math.max (0, color.b - 50)
    );
    let darkerColorHexString = '#' + OV.ColorToHexString (darkerColor);
    let circleDiv = OV.CreateDiv ('ov_color_circle');
    circleDiv.style.background = hexString;
    circleDiv.style.border = '1px solid ' + darkerColorHexString;
    return circleDiv;
};

OV.InstallVerticalSplitter = function (splitterDiv, resizedDiv, flipped, onResize)
{
    let originalWidth = null;
    CreateVerticalSplitter (splitterDiv, {
        onSplitStart : () => {
            originalWidth = OV.GetDomElementOuterWidth (resizedDiv);
        },
        onSplit : (xDiff) => {
            const minWidth = 280;
            const maxWidth = 450;
            let newWidth = 0;
            if (flipped) {
                newWidth = originalWidth - xDiff;
            } else {
                newWidth = originalWidth + xDiff;
            }
            if (newWidth < minWidth) {
                newWidth = minWidth;
            } else if (newWidth > maxWidth)  {
                newWidth = maxWidth;
            }
            OV.SetDomElementOuterWidth (resizedDiv, newWidth);
            onResize ();
        }
    });
};

OV.GetFilesFromDataTransfer = function (dataTransfer, onReady)
{
    async function GetFileEntriesFromDirectory (dirEntry, fileEntries)
    {
        let reader = dirEntry.createReader ();
        return new Promise ((resolve, reject) => {
            reader.readEntries (
                async (dirEntries) => {
                    for (let entry of dirEntries) {
                        if (entry.isFile) {
                            fileEntries.push (entry);
                        } else if (entry.isDirectory) {
                            await GetFileEntriesFromDirectory (entry, fileEntries);
                        }
                    }
                    resolve ();
                },
                (error) => {
                    reject (error);
                }
            );
        });
    }

    async function GetFileObjectsFromEntries (entries, onReady)
    {
        let fileEntries = [];
        for (let entry of entries) {
            if (entry.isFile) {
                fileEntries.push (entry);
            } else if (entry.isDirectory) {
                await GetFileEntriesFromDirectory (entry, fileEntries);
            }
        }

        let fileObjects = await Promise.all (fileEntries.map ((fileEntry) => {
            return new Promise ((resolve, reject) => {
                fileEntry.file (
                    (file) => {
                        resolve (file);
                    },
                    (error) => {
                        reject (error);
                    }
                );
            });
        }));

        onReady (fileObjects);
    }

    let getAsEntryFunc = null;
    if (DataTransferItem) {
        if (DataTransferItem.prototype.getAsEntry) {
            getAsEntryFunc = DataTransferItem.prototype.getAsEntry;
        } else if (DataTransferItem.prototype.webkitGetAsEntry) {
            getAsEntryFunc = DataTransferItem.prototype.webkitGetAsEntry;
        }
    }

    if (getAsEntryFunc !== null) {
        let entries = [];
        for (let item of dataTransfer.items) {
            entries.push (getAsEntryFunc.call (item));
        }
        GetFileObjectsFromEntries (entries, (allEntries) => {
            onReady (allEntries);
        });
    } else {
        onReady (dataTransfer.files);
    }
};
