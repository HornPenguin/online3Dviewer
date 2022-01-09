export let ExternalLibLocation = null;
export let LoadedExternalLibs = new Set ();

export function LoadExternalLibrary (libName)
{
    return new Promise ((resolve, reject) => {
        if (ExternalLibLocation === null) {
            reject ();
            return;
        }

        if (LoadedExternalLibs.has (libName)) {
            resolve ();
            return;
        }

        let scriptElement = document.createElement ('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = ExternalLibLocation + '/' + libName;
        scriptElement.onload = () => {
            LoadedExternalLibs.add (libName);
            resolve ();
        };
        scriptElement.onerror = () => {
            reject ();
        };
        document.head.appendChild (scriptElement);
    });
};
