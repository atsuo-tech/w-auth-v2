"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

export default function LoginUI() {

	return (
		<div>
			<h1>ログイン</h1>
			<form
				action={async (formData: FormData) => {
					const username = formData.get("username");
					const password = formData.get("password");
					if (typeof username !== "string" || typeof password !== "string") {
						throw new Error("Invalid form data");
					}
					await db.userAuth.findFirst({
						where: {
							value: crypto.createHash('sha512').update(password).digest('hex'),
							authType: "PASSWORD",
						},
						select: {
							user: {
								select: {
									uniqueId: true,
								},
							},
						},
					});
					const userToken = crypto.randomBytes(64).toString('hex');
					await db.loginSession.create({
						data: {
							user: {
								connect: {
									uniqueId: username,
								},
							},
							sessionToken: userToken,
							expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6), // 6 months
						},
					});
					// Set cookie
					const cookieStore = await cookies();
					cookieStore.set({
						name: "SESSION_TOKEN",
						value: userToken,
						domain: process.env.DOMAIN_SCOPE || "localhost",
						httpOnly: true,
						path: "/",
						maxAge: 60 * 60 * 24 * 30 * 6, // 6 months
					});
					redirect("/");
				}}
			>
				<input type="text" placeholder="ユーザー名" />
				<br />
				<input type="password" placeholder="パスワード" />
				<br />
				<button
					type="submit"
				>
					ログイン
				</button>
			</form>
		</div>
	);

}
