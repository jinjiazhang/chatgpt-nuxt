import type { ChatPromptCategoryItem, ChatSettingItem } from "@/types";

export type ChatModel = "gpt-3.5-turbo" | "gpt-4-turbo" | "gpt-4o" | "dall-e";

export type ImageSize = "256x256" | "512x512" | "1024x1024";

export interface ChatItem extends ChatOption {
  id: number;
}

export interface ChatOption {
  promptId?: ChatPromptCategoryItem["id"];
  settingId?: ChatSettingItem["id"];
  name: string;
  model?: ChatModel;
  order: number;
}
