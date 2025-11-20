export const swaggerOptions = {
  openapi: {
    info: {
      title: "Expense Trackr API Documentation",
      description:
        "API documentation for the personal finance management backend.",
      version: "1.0.0",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
    servers: [
      {
        url: "http://localhost:8085",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          name: "session_id",
          in: "cookie",
        },
      },
    } as const,
    tags: [
      {
        name: "user",
        description: "User authentication and profile management",
      },
      { name: "transaction", description: "Managing incomes and expenses" },
      { name: "account", description: "Managing financial accounts" },
      { name: "category", description: "Managing transaction categories" },
      { name: "report", description: "Financial data analysis and exports" },
    ],
  },
};
