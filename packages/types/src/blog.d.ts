export type BlogPost = {
  isFeatured: boolean;
  isExternalLink?: boolean;
  title: string;
  href: string;
  category: Array<Category> | Category;
  description: string;
  date: string;
  datetime: string;
  imageUrl: string;
  readingTime: string;
  author: {
    name: string;
    href: string;
    imageUrl: string | null;
  };
};
type Category = { name: string; href: string; color: string };
