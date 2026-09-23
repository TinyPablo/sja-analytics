import type { components } from "./schema";

/**
 * Hand-picked aliases over the generated OpenAPI schema, so app code imports
 * meaningful names instead of reaching into `components["schemas"][...]`.
 */
export type HealthResponse = components["schemas"]["HealthResponse"];

export type { components, paths } from "./schema";
