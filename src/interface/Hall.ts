export interface Hall {
  _key: string;
  name: string;
  surname: string;
  address?: string;
  ancestor?: string;
  buildTime?: string;
  city?: string;
  cover?: string;
  hall?: string;
  lat?: number;
  lng?: number;
  panoUrl?: string;
  province?: string;
  updateTime?: number;
  viewCount?: number;
}
export interface HallDetail extends Hall {
  creator: string;
  description?: string;
  imageDimensions?: string;
  imageList?: string[];
}
