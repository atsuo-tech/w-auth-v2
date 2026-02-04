"use server";

import { cookies } from "next/headers";
import { db } from "./db";

export async function getCurrentUser() {

	const cookieStore = await cookies();

	const user = await db.loginSession.findFirst({
		where: {
			sessionToken: {
				equals: cookieStore.get("SESSION_TOKEN")?.value || "",
			},
		},
		select: {
			user: {
				select: {
					uniqueId: true,
					username: true,
					realname: true,
					studentId: true,
					grade: true,
					createdAt: true,
				},
			},
		},
	});

	return user?.user || null;

}
