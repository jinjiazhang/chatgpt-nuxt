import { RequestHeaders } from "h3";
import type { ApiType } from "@/types";
import { errorHandler, setResStatus } from "~/server/utils/h3";
import { getOpenAIApiInstance } from "../utils/openai";

const runtimeConfig = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const headers = getHeaders(event);
    const response = await listModels(headers);

    setResStatus(event, response.status, response.statusText);
    return response.data;
  } catch (e: any) {
    return await errorHandler(event, e);
  }
});

async function listModels(headers: RequestHeaders) {
  const openai = getOpenAIApiInstance("models", headers);

  const useEnv = runtimeConfig.public.useEnv === "yes";
  const apiType = useEnv
    ? runtimeConfig.public.apiType
    : (headers["x-api-type"] as ApiType);
  const azureGpt4DeploymentId = useEnv
    ? runtimeConfig.azureGpt4DeploymentId
    : headers["x-azure-gpt4-deployment-id"]!;

  switch (apiType) {
    // Fetch available models from OpenAI API
    case "openai":
      return openai.listModels();

    // Unknown API Type
    default:
      // Generate error response compatible with AxiosResponse
      return {
        data: {},
        status: 400,
        statusText: "Bad Request",
        config: {},
        request: {},
      };
  }
}
