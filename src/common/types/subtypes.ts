export interface SubtypesRequest {
  id: string;
  name: string;
  typeId: string;
}

export interface SubtypesResponse {
  message: string;
  data: {
    subtypes: SubtypesShort[];
  };
}

interface SubtypesShort {
  id: string;
  name: string;
}
