function completeKeys(keyFields: string[], data: object) {
    for (const field of keyFields) {
        if (!(field in data)) {
            return false;
        }
    }
    return true;
}

function isWhiteListed(keyFields: string[], data: string[]) {
    for (const item of data) {
        if (!keyFields.includes(item)) {
            return false;
        }
    }
    return true;
}

export { completeKeys, isWhiteListed }