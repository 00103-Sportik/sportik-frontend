export interface SubtypesRequest {
  name: string;
  type?: string;
}

export interface SubtypeResponse {
  uuid: string;
  name: string;
  user_uuid: string | null;
}

export interface SubtypesResponse {
  message: string;
  data: {
    subtypes: SubtypeResponse[];
  };
}
