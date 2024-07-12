import type calculateReadingTime from "reading-time";

export type ActionData = {
  error?: string;
};

export type MdxPage = {
  code: string;
  slug: string;
  readTime?: ReturnType<typeof calculateReadingTime>;
  frontmatter: {
    cloudinaryImageId?: string;
    archived?: boolean;
    draft?: boolean;
    unlisted?: boolean;
    title?: string;
    description?: string;
    meta?: {
      keywords?: Array<string>;
    };
    categories?: Array<string>;
    date?: string;
  };
};

type Frontmatter = MdxPage["frontmatter"];

export type MdxListItem = Omit<MdxPage, "code" | "frontmatter"> & Frontmatter;
