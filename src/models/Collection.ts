export interface Collection {
    id?: string;
    name: string;
    tags: string[];
    description: string;
    ownerEmail?: string;
    userEmails: string[];
    lastModifiedDate?: Date;
}
