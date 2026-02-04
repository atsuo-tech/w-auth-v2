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
					"use server";
					const username = formData.get("username");
					const password = formData.get("password");
					if (typeof username !== "string" || typeof password !== "string") {
						throw new Error("Invalid form data");
					}
					const user = await db.userAuth.findFirst({
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
					if (!user) {
						redirect("/login?error=invalid_credentials");
					}
					const userToken = crypto.randomBytes(64).toString('hex');
					await db.loginSession.create({
						data: {
							user: {
								connect: {
									uniqueId: user?.user.uniqueId,
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
				<input type="text" placeholder="ユーザー名" name="username" />
				<br />
				<input type="password" placeholder="パスワード" name="password" />
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
