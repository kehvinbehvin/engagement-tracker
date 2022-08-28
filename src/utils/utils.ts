function completeKeys(keyFields: string[], data: object) {
    for (const field of keyFields) {
        if (!(field in data)) {
            return false;
        }
    }
    return true;
}

function isWhiteListed(keyFields: string[], data: object) {
    const invalidKeys: string[] = []
    for (const field in data) {
        if (!keyFields.includes(field)) {
            invalidKeys.push(field);
        }
    }

    return invalidKeys;
}


export { completeKeys, isWhiteListed }