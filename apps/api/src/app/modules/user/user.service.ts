import type {
  UpdateProfileInput,
  CreateAddressInput,
  UpdateAddressInput,
} from "@our-sunnah/validation";
import { prisma } from "../../../shared/prisma.js";
import AppError from "../../error/AppError.js";

const USER_PROFILE_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  avatar: true,
  gender: true,
  dateOfBirth: true,
  emailVerified: true,
  createdAt: true,
};

const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { ...USER_PROFILE_SELECT, addresses: { orderBy: { isDefault: "desc" } } },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};

const updateProfile = async (userId: string, payload: UpdateProfileInput) => {
  return prisma.user.update({
    where: { id: userId },
    data: payload,
    select: USER_PROFILE_SELECT,
  });
};

const listAddresses = async (userId: string) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" },
  });
};

/**
 * When a new address is marked default (or it's the user's very first
 * address), every other address for that user is un-set as default
 * inside the same transaction, so there's never more than one default.
 */
const createAddress = async (userId: string, payload: CreateAddressInput) => {
  const existingCount = await prisma.address.count({ where: { userId } });
  const shouldBeDefault = payload.isDefault || existingCount === 0;

  return prisma.$transaction(async (tx) => {
    if (shouldBeDefault) {
      await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    return tx.address.create({
      data: { ...payload, userId, isDefault: shouldBeDefault },
    });
  });
};

const updateAddress = async (userId: string, addressId: string, payload: UpdateAddressInput) => {
  const existing = await prisma.address.findFirst({ where: { id: addressId, userId } });
  if (!existing) {
    throw new AppError(404, "Address not found");
  }

  return prisma.$transaction(async (tx) => {
    if (payload.isDefault) {
      await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    return tx.address.update({
      where: { id: addressId },
      data: payload,
    });
  });
};

const deleteAddress = async (userId: string, addressId: string) => {
  const existing = await prisma.address.findFirst({ where: { id: addressId, userId } });
  if (!existing) {
    throw new AppError(404, "Address not found");
  }

  await prisma.address.delete({ where: { id: addressId } });
};

export const UserService = {
  getProfile,
  updateProfile,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
