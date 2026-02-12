import crypto from "crypto";
import fs from "fs/promises";
import fetch from "node-fetch";
import path from "path";
import sharp from "sharp";
import { fetchAPI } from "./base";

// Get post slugs only (lightweight for generateStaticParams)
export async function getPostSlugs(first = 500) {
  const data = await fetchAPI(
    `query GetPostSlugs($first: Int = 500) {
      posts(first: $first) {
        nodes {
          excerpt
          slug
          title
          date
          author {
            node {
              id
              name
            }
          }
          tags {
            nodes {
              id
              name
            }
          }
          categories {
            nodes {
              id
              name
            }
          }
          localization {
            language
          }
        }
      }
    }`,
    {
      variables: { first },
    }
  ).catch((error) => {
    console.error("Error fetching post slugs", error);
    return { posts: { nodes: [] } };
  });

  return data?.posts?.nodes ?? [];
}

// Get all english posts
export async function getPosts(first = 500) {
  const data = await fetchAPI(
    `query FetchPosts ($first: Int = 500) {
        posts (first: $first ) {
          nodes {
            excerpt
            slug
            title
            date
            author {
              node {
                id
                name
              }
            }
            featuredImage{
              node {
                id
                sourceUrl
              }
            }
            tags {
              nodes {
                id
                name
              }
            }
            categories {
              nodes {
                id
                name
              }
            }
            localization {
              language
            }
          }
        }
      }`,
    {
      variables: {
        first,
      },
    },
  ).catch((error) => {
    console.error("Error fetching posts", error);
    return [];
  });

  return data?.posts?.nodes;
}

// Get all posts by a language
export async function getPostsByLanguage(first = 500) {
  const data = await fetchAPI(
    `query FetchPosts ($first: Int = 500) {
      posts (first: $first) {
        nodes {
          excerpt
          slug
          date
          title
          author {
            node {
              id
              name
            }
          }
          content
          featuredImage{
            node{
              id
              sourceUrl
            }
          }
          categories {
            nodes {
              id
              name
            }
          }
          tags {
            nodes {
              id
              name
            }
          }
          localization {
            language
            englishSlug
          }
        }
      }
    }`,
    {
      variables: {
        first,
      },
    },
  ).catch((error) => {
    console.error("Error fetching posts by language", error);
    return { posts: { nodes: [] } };
  });

  interface WordPressPost {
    excerpt?: string | null;
    slug?: string | null;
    date?: string | null;
    title?: string | null;
    author?: {
      node?: {
        id?: string | null;
        name?: string | null;
      };
    } | null;
    content?: string | null;
    featuredImage?: {
      node?: {
        id?: string | null;
        sourceUrl?: string | null;
      };
    } | null;
    categories?: {
      nodes?: Array<{
        id?: string | null;
        name?: string | null;
      }>;
    };
    tags?: {
      nodes?: Array<{
        id?: string | null;
        name?: string | null;
      }>;
    };
    localization?: {
      language?: string | null;
      englishSlug?: string | null;
    };
  }

  const posts = data?.posts?.nodes ?? [];
  return posts.map((post: WordPressPost) => ({
    excerpt: post.excerpt ?? null,
    slug: post.slug ?? null,
    date: post.date ?? null,
    title: post.title ?? null,
    author: post.author
      ? {
          node: {
            id: post.author.node?.id ?? null,
            name: post.author.node?.name ?? null,
          },
        }
      : null,
    content: post.content ?? null,
    featuredImage: post.featuredImage
      ? {
          node: {
            id: post.featuredImage.node?.id ?? null,
            sourceUrl: post.featuredImage.node?.sourceUrl ?? null,
          },
        }
      : null,
    categories: {
      nodes:
        post.categories?.nodes?.map((cat) => ({
          id: cat?.id ?? null,
          name: cat?.name ?? null,
        })) ?? [],
    },
    tags: {
      nodes:
        post.tags?.nodes?.map((tag) => ({
          id: tag?.id ?? null,
          name: tag?.name ?? null,
        })) ?? [],
    },
    localization: {
      language: post.localization?.language ?? null,
      englishSlug: post.localization?.englishSlug ?? null,
    },
  }));
}

export async function getAllCategories() {
  const data = await fetchAPI(
    `query GetCategoryEdges {
      categories {
          nodes {
            id
            name
          }
      }
    }`,
  );

  return data?.categories?.nodes ?? [];
}

export async function getSingleCategory(id: string) {
  const data = await fetchAPI(
    `query GetSingleCategory ($id: ID = "") {
      category (id : $id) {
            id
            name
          }
      }`,
    {
      variables: {
        id,
      },
    },
  );

  return data?.category;
}

export async function getPostBySlug(slug: string) {
  const data = await fetchAPI(
    `query GetPost($id: ID = "") {
      post(id: $id, idType: SLUG) {
        content
        slug
        title
        date
        seo {
          metaDesc
        }
        categories {
          nodes {
            id
            name
          }
        }
        author {
      		node {
        	  id
            name
            description
            avatar {
              url
            }
      	  }
        }
        featuredImage{
          node{
            id
            sourceUrl
          }
        }
        tags {
          nodes {
            id
            name
          }
        }
        localization {
          language
          englishSlug
        }
      }
    }`,
    {
      variables: {
        id: slug,
      },
    },
  );

  return data?.post ?? {};
}

export async function optimizeAndSaveImage(imageUrl: string, quality = 85) {
  try {
    // Validate if URL appears to be an image
    const validImageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
    ];
    const hasValidExtension = validImageExtensions.some((ext) =>
      imageUrl.toLowerCase().includes(ext),
    );

    if (!hasValidExtension) {
      return imageUrl; // Return original URL for non-image files
    }

    // Create a shorter hash of the URL using a more compact algorithm
    const urlHash = crypto.createHash("md5").update(imageUrl).digest("hex");

    const outputPath = path.join(
      process.cwd(),
      "public",
      "optimized-images",
      `${urlHash}.webp`,
    );

    // Check if image already exists
    try {
      await fs.access(outputPath);
      return `/optimized-images/${urlHash}.webp`;
    } catch {
      // Image doesn't exist, proceed with optimization
      // No need to log access error as it's expected for new images
    }

    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(
        `Failed to fetch image: ${response.status} ${response.statusText}`,
      );
      return imageUrl; // Return original URL if fetch fails
    }

    const buffer = await response.buffer();

    // Ensure directory exists
    await fs.mkdir(path.join(process.cwd(), "public", "optimized-images"), {
      recursive: true,
    });

    // Convert to WebP and save
    await sharp(buffer).webp({ quality }).toFile(outputPath);

    return `/optimized-images/${urlHash}.webp`;
  } catch (error) {
    console.error("Error optimizing image:", error);
    return imageUrl; // Fallback to original URL if optimization fails
  }
}

interface PostWithContent {
  content?: string;
  [key: string]: unknown;
}

export async function optimizePostImages(post: PostWithContent) {
  if (!post.content) return post;

  const imageRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  let optimizedContent = post.content;

  while ((match = imageRegex.exec(post.content)) !== null) {
    const originalUrl = match[1];
    const optimizedPath = await optimizeAndSaveImage(originalUrl);
    optimizedContent = optimizedContent.replace(originalUrl, optimizedPath);
  }

  return {
    ...post,
    content: optimizedContent,
  };
}
