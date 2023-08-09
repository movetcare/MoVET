export type BlogPost = {
  isFeatured: boolean;
  isExternalLink?: boolean;
  title: string;
  href: string;
  category: { name: string; href: string; color: string };
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
