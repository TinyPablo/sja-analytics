import type { HealthResponse } from "@sja/api-types";

import { apiGet } from "@/api/client";

export function fetchHealth(): Promise<HealthResponse> {
  return apiGet<HealthResponse>("/health");
}
