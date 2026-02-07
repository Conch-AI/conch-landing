export type Post = {
  title: string;
  publishedAt: string;
  author: {
    node: {
      name: string;
      description: string;
      avatar: {
        url: string;
      };
    };
  };
  featuredImage: {
    node: {
      id: string;
      sourceUrl: string;
    };
  };
  slug: string;
  seo: {
    metaDesc: string;
  };
  tags: {
    nodes: [
      {
        id: string;
        name: string;
      },
    ];
  };
  content: any;
  meta: string;
  date: Date;
  categories: {
    name: string;
    nodes: [
      {
        id: string;
        name: string;
      },
    ];
  };
  localization: {
    language: string;
    englishSlug: string;
  };
};
