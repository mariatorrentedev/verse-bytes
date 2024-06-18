import { db } from "../app/utils/db.server";

export const createUser = async (
  email: string,
  passwordHash?: string,
  name?: string
) => {
  return await db.$transaction(async (prisma) => {
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name ?? "",
        role: "MEMBER",
      },
    });

    if (passwordHash) {
      await prisma.password.create({
        data: {
          hash: passwordHash,
          userId: newUser.id,
        },
      });
    }

    return newUser;
  });
};

export const getUserByEmail = async (email: string) => {
  return await db.user.findUnique({
    where: { email },
  });
};

export const getUserWithPasswordByEmail = async (email: string) => {
  return await db.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });
};

export const getUserById = async (id: string) => {
  return await db.user.findUnique({
    where: { id },
  });
};

export const getUsers = async () => {
  return await db.user.findMany();
};

export const updateUser = async (email?: string, name?: string) => {
  return await db.user.update({
    where: { email },
    data: {
      email,
      name,
    },
  });
};

export const deleteUser = async (email: string) => {
  return await db.user.delete({
    where: { email },
  });
};

export const deleteUsers = async () => {
  return await db.user.deleteMany();
};
