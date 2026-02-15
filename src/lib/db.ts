import { PrismaClient } from "@atsuo-tech/w-auth-v2-prisma";

export const db = new PrismaClient({
	accelerateUrl: process.env.PRISMA_ACCELERATE_URL!,
});
