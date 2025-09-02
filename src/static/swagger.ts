import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "URL Shortener API",
      version: "1.0.0",
      description: "API documentation for the URL Shortener service",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Local server",
      },
      {
        url: "https://url-shortener-service-7vhn.onrender.com",
        description: "Production server",
      },
    ],
  },
  // Look for JSDoc comments in these files
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
