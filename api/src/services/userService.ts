import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateUserInput {
  name: string;
  email: string;
  auth0Id: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
}

const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      include: {
        accounts: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users,", error);
    throw error;
  }
};

const getUserById = async (auth0Id: string): Promise<User | null> => {
  if (!auth0Id) {
    throw new Error("auth0Id must be provided");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { auth0Id },
      include: { accounts: true },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by auth0Id:", error);
    throw error;
  }
};

const createUser = async ({ auth0Id, name, email }: CreateUserInput) => {
  return await prisma.user.create({
    data: { auth0Id, name, email },
  });
};

const deleteUser = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting user", error);
  }
};

const updateUser = async (id: string, { name, email }: UpdateUserInput) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user", error);
  }
};

export { getAllUsers, getUserById, createUser, deleteUser, updateUser };
