export const CookieKey = {
    ACCESS_TOKEN: 'ACCESS_TOKEN'
}

export const SessionKey = {
    ALL_COLLECTIONS: 'ALL_COLLECTIONS',
    IMAGES: (collectionId: string) => `${collectionId}_IMAGES`,
    VIDEOS: (collectionId: string) => `${collectionId}_VIDEOS`,
}
