/**
 * Data API helper — previously used Manus WebDev service.
 * Currently disabled. Implement direct API calls as needed.
 */

export type DataApiCallOptions = {
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  pathParams?: Record<string, unknown>;
  formData?: Record<string, unknown>;
};

export async function callDataApi(
  apiId: string,
  options: DataApiCallOptions = {}
): Promise<unknown> {
  throw new Error(
    `Data API "${apiId}" is not available — Manus Forge service was removed. Implement direct API calls.`
  );
}
