import type { GetLibrariesResponse, GetLibraryResponse } from "../core/types";

export const libraryResponse: GetLibraryResponse = {
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

export const librariesResponse: GetLibrariesResponse = {
  data: [
    {
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
    {
      id: 2,
      title: "Music",
      fields: {
        Artist: "line",
        Title: "line",
        Album: "line",
        Genre: "line",
        Year: "date",
        Rating: "rating5",
        Lyrics: "text",
      },
    },
  ],
};