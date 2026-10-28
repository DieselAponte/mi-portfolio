export interface HomeCaseOfStudy {
  id: string | number;
  title: string;
  description: string;
  tags: string[];
  order_index: number;
  image_url?: string;
}

export interface HomeService {
  id: string | number;
  title: string;
  description: string;
  highlights: string[];
  order_index: number;
}

export interface HomeAbout {
  id?: string | number;
  image_url: string;
  bio?: string;
}
