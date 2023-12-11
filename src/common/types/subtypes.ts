export interface SubtypesRequest {
  id?: string;
  name: string;
  type?: string;
}

export interface SubtypesResponse {
  message: string;
  data: {
    subtypes: SubtypesRequest[];
  };
}
