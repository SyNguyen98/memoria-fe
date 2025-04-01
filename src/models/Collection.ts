export type Collection = {
    id?: string;
    name: string;
    tags: string[];
    description: string;
    ownerEmail?: string;
    userEmails: string[];
    lastModifiedDate?: Date;
    locations: {
        name: string;
        isoLevel: string;
        coordinate: {
            latitude: number;
            longitude: number;
        };
    }[];
}
