export interface Video {
  link: string;
  category: string;
  description: string;
}

export interface Category {
  name: string;
}

export const videos: Video[] = [];
export const categories: Category[] = [{ name: "Alex watch this" }];



