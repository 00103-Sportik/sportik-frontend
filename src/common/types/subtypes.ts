export interface SubtypeRequest {
    id: string;
    name: string;
    typeId: string;
}

export interface SubtypeResponse {
    message: string;
    data: {
        subtypes: SubtypeShort[];
    }
}

interface SubtypeShort {
    id: string;
    name: string;
}
