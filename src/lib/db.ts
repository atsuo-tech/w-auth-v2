import { PrismaClient } from "@atsuo-tech/w-auth-v2-prisma";
import { PrismaPg } from "@prisma/adapter-pg";

export const db = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: process.env.DATABASE_URL!,
	}),
});
