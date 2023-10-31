export const REACTLY_API_ENDPOINT =
  "https://vbd4gutwbj.execute-api.us-east-1.amazonaws.com";
export const MYSQL_API_ENDPOINT = `https://i16ajae1q5.execute-api.us-east-1.amazonaws.com`;

export const STYLEBIT = {
  LAYOUT: 1,
  COLOR: 2,
  FONT: 4,
  BORDER: 8,
  SPACING: 16,
  BACKGROUND: 32,
  DIMENSION: 64,
  POSITION: 128,
};

export const eventTypes = [
  {
    name: "onPageLoad",
    description: "Page  finishes loading.",
  },
  {
    name: "dataLoaded",
    description: "Data finishes loading.",
  },
  {
    name: "loadStarted",
    description: "Data starts loading.",
  },
];
