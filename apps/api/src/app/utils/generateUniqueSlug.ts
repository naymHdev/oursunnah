import slugify from "slugify";

type SlugExistsChecker = (slug: string) => Promise<boolean>;

interface GenerateUniqueSlugOptions {
  lower?: boolean;
  strict?: boolean;
  separator?: string;
}

export const generateUniqueSlug = async (
  name: string,
  checker: SlugExistsChecker,
  options: GenerateUniqueSlugOptions = {}
): Promise<string> => {
  const { lower = true, strict = true, separator = "-" } = options;

  const base = slugify(name, { lower, strict, replacement: separator });
  let slug = base;
  let count = 0;

  while (await checker(slug)) {
    count++;
    slug = `${base}${separator}${count}`;
  }

  return slug;
};
