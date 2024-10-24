import { ContentfulContentSource } from "@stackbit/cms-contentful";

import { defineStackbitConfig } from "@stackbit/types";
import type { SiteMapEntry } from "@stackbit/types";

const getUrlPath = (document) => {
  switch (document.modelName) {
    case "bookAuthor":
      return `/author/${document.id}`;
    case "bookReferencePage":
      return `/books/${document.id}`;
    default:
      return `/`;
  }
};

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  nodeVersion: "18",
  ssgName: "astro",
  postInstallCommand:
    "npm i --no-save @stackbit/types @stackbit/cms-contentful",
  contentSources: [
    new ContentfulContentSource({
      spaceId: process.env.CONTENTFUL_SPACE_ID!,
      environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
      previewToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
    }),
  ],
  modelExtensions: [
    {
      name: "bookReferencePage",
      type: "page",
    },
    { name: "bookAuthor", type: "page" },
  ],
  siteMap: ({ documents }): SiteMapEntry[] => {
    return documents
      .filter((document) =>
        ["bookAuthor", "bookReferencePage"].includes(document.modelName)
      )
      .map((document) => {
        return {
          stableId: document.id,
          label: document.fields.title as unknown as "string",
          urlPath: getUrlPath(document),
          document: document,
        };
      });
  },
});
