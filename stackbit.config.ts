import { ContentfulContentSource } from '@stackbit/cms-contentful';

import {
  defineStackbitConfig,
  getLocalizedFieldForLocale,
  SiteMapEntry
} from "@stackbit/types";

export default defineStackbitConfig({
    "stackbitVersion": "~0.6.0",
    "nodeVersion": "18",
    "ssgName": "astro",
    postInstallCommand: 'npm i --no-save @stackbit/types @stackbit/cms-contentful',
    "contentSources": [
        new ContentfulContentSource({
            spaceId: process.env.CONTENTFUL_SPACE_ID!,
            environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
            previewToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
            accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!
        }),
    ],
    modelExtensions: [
    { name: "Book", type: "page", urlPath: "/books/{slug}" },
    { name: "Author", type: "page", urlPath: "/author/{slug}" }
  ],
  siteMap: ({ documents, models }) => {
    const pageModels = models.filter(m => m.type === "page").map(m => m.name);
    return documents
      .filter(d => pageModels.includes(d.modelName))
      .map(document => {
        return {
          stableId: document.id,
          urlPath: document.slug,
          document,
          isHomePage: document.slug === "/"
        };
      })
      .filter(Boolean) as SiteMapEntry[];
  }
});
