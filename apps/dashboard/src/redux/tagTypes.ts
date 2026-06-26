export const tagTypes = {
  auth: "auth",
  user: "user",
  category: "category",
  product: "product",
  order: "order",
  analytics: "analytics",
} as const;

export type TagType = (typeof tagTypes)[keyof typeof tagTypes];

export const tagTypesList = Object.values(tagTypes) as TagType[];
