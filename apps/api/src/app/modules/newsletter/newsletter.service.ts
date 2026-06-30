import type {
  SubscribeNewsletterInput,
  UnsubscribeNewsletterInput,
} from "@our-sunnah/validation";
import { prisma } from "../../../shared/prisma.js";
import AppError from "../../error/AppError.js";

// ── Subscribe ──────────────────────────────────────────────────────────────

const subscribe = async (payload: SubscribeNewsletterInput, userId?: string) => {
  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: payload.email },
  });

  if (existing) {
    if (existing.status === "ACTIVE") {
      throw new AppError(409, "This email is already part of the Noor Circle");
    }

    // Previously unsubscribed — re-activate instead of erroring, so a
    // returning subscriber gets a warm welcome-back rather than a wall.
    return prisma.newsletterSubscriber.update({
      where: { email: payload.email },
      data: {
        status: "ACTIVE",
        source: payload.source ?? existing.source,
        userId: userId ?? existing.userId,
        unsubscribedAt: null,
      },
    });
  }

  return prisma.newsletterSubscriber.create({
    data: {
      email: payload.email,
      source: payload.source,
      userId,
    },
  });
};

// ── Unsubscribe ────────────────────────────────────────────────────────────

const unsubscribe = async (payload: UnsubscribeNewsletterInput) => {
  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: payload.email },
  });

  if (!existing) throw new AppError(404, "Email not found in our newsletter list");
  if (existing.status === "UNSUBSCRIBED") {
    throw new AppError(409, "This email is already unsubscribed");
  }

  return prisma.newsletterSubscriber.update({
    where: { email: payload.email },
    data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
  });
};

export const NewsletterService = {
  subscribe,
  unsubscribe,
};
