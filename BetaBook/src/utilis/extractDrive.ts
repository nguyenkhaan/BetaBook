const extractGoogleDriveFileId = (url: string): string | null => {
    const patterns = [/\/d\/([^/]+)/, /id=([^&]+)/];

    for (const pattern of patterns) {
        const match = url.match(pattern);

        if (match?.[1]) {
            return match[1];
        }
    }

    return null;
}; 
export {extractGoogleDriveFileId}