import type { LibrarySchema } from "../core/types";

type LibraryResponse = {
  data: LibrarySchema;
  meta: {
    created_at: string;
    items_count: number;
  };
};

export const libraryResponse: LibraryResponse = {
  data: {
    id: 1,
    title: "Movies",
    fields: {
      "Movie Title": "line",
      "Origin Title": "line",
      "Release Date": "date",
      Description: "text",
      "IMDB URL": "url",
      "IMDB Rating": "rating10",
      "My Rating": "rating5precision",
      Watched: "checkmark",
      "Watched At": "datetime",
      "Chance to Advice": "priority",
    },
  },
  meta: {
    created_at: "1970-01-01 00:00:00",
    items_count: 1,
  },
};
