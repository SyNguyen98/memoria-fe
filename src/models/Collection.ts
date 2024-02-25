export interface Collection {
    id?: string;
    name: string;
    description: string;
    ownerEmail?: string;
    userEmails: string[];
    lastModifiedDate?: Date;
}
