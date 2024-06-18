import { db } from "../app/utils/db.server";

export const getOAuthAccount = async (provider: string, providerId: string) => {
  return await db.oAuthAccount.findFirst({
    where: { provider, providerId },
  });
};

export const createOAuthAccount = async (
  provider: string,
  providerId: string,
  userId: string
) => {
  return await db.oAuthAccount.create({
    data: { provider, providerId, userId },
  });
};
