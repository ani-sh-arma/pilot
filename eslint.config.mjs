import nextVitals from "eslint-config-next/core-web-vitals";
import drizzle from "eslint-plugin-drizzle";

export default [
  ...nextVitals,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      drizzle,
    },
    rules: {
      "drizzle/enforce-delete-with-where": [
        "error",
        {
          drizzleObjectName: ["db", "ctx.db"],
        },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        {
          drizzleObjectName: ["db", "ctx.db"],
        },
      ],
    },
  },
];
