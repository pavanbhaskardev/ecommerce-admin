import ApiKey from "@/models/apiKeys";
import { auth } from "@clerk/nextjs/server";

export const validateAPIRequest = async ({ headers }) => {
  const apiKey = headers.get("x-store-api-key") ?? "";
  const hashedKey = ApiKey.hashKey(apiKey);

  // 1. if key is not there checking doing clerk authentication
  if (!apiKey) {
    const { userId } = await auth();

    if (!userId) {
      return {
        userId: null,
      };
    }
  }

  let key;

  try {
    // todo: need to add read/write validation also
    key = await ApiKey.findOne({
      keyHash: hashedKey,
      isActive: true,
    });
  } catch (error) {
    console.log({ error });
  } finally {
    return { userId: key?.userId ?? null };
  }
};
