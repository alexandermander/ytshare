export interface Video {
  link: string;
  category: string;
  description: string;
}

export interface Category {
  name: string;
  x: number;
  y: number;
}

export const videos: Video[] = [];
export const categories: Category[] = [{ name: "General", x: 0, y: 0 }];
