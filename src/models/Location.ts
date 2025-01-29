export interface Location {
    id?: string;
    takenYear: number;
    takenMonth?: number;
    takenDay?: number;
    takenTime?: string;
    coordinate: Coordinate;
    place: string;
    description: string;
    collectionId?: string;
}

interface Coordinate {
    latitude: number;
    longitude: number;
}
