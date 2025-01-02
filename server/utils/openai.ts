import { RequestHeaders } from "h3";
import { aesCrypto } from "~/server/api/crypto.post";
import { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";
import type { ApiRequest, ApiRequestModel, ApiType, ChatModel } from "~/types";
import { createAxiosInstance } from "./axios";
import { AzureOpenAIApi } from "./azure";

const runtimeConfig = useRuntimeConfig();

function createOpenAIConfiguration(
  model: ApiRequestModel,
  headers: RequestHeaders,
  body?: ApiRequest
) {
  const useEnv = runtimeConfig.public.useEnv === "yes";
  const apiKey = useEnv
    ? runtimeConfig.apiKey
    : aesCrypto({ message: headers["x-cipher-api-key"]!, type: "de" });

  return new Configuration({
    apiKey,
  });
}

export function getOpenAIApiInstance(
  model: ApiRequestModel,
  headers: RequestHeaders,
  body?: ApiRequest
) {
  const configuration = createOpenAIConfiguration(model, headers, body);
  const axiosInstance = createAxiosInstance();

  const useEnv = runtimeConfig.public.useEnv === "yes";
  const apiType = useEnv
    ? runtimeConfig.public.apiType
    : (headers["x-api-type"] as ApiType);

  if (apiType === "azure") {
    return new AzureOpenAIApi(configuration, undefined, axiosInstance);
  } else {
    return new OpenAIApi(configuration, undefined, axiosInstance);
  }
}
