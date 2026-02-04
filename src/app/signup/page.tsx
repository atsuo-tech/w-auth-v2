"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

export default function SignupUI() {

	return (
		<div>
			<h1>サインアップ</h1>
			<form
				action={async (formData: FormData) => {
					const username = formData.get("username");
					const password = formData.get("password");
					const realname = formData.get("realname");
					const grade = formData.get("grade");
					const token = formData.get("token");
					const studentId = formData.get("studentId");
					if (typeof username !== "string" || typeof password !== "string" || typeof token !== "string" || typeof realname !== "string" || typeof grade !== "string" || typeof studentId !== "string") {
						redirect("/signup?error=invalid_input");
					}
					const existingUser = await db.authUser.findFirst({
						where: {
							username: username,
						},
					});
					if (existingUser) {
						redirect("/signup?error=user_exists");
					}
					const registrationToken = await db.systemToken.findFirst({
						where: {
							tokenHash: crypto.createHash("sha512").update(token).digest("hex"),
							type: "CREATE_ACCOUNT",
							expiresAt: {
								gt: new Date(),
							},
						},
					});
					if (!registrationToken) {
						redirect("/signup?error=invalid_token");
					}
					const sessionToken = crypto.randomBytes(64).toString("hex");
					await db.authUser.create({
						data: {
							username: username,
							userAuths: {
								create: {
									authType: "PASSWORD",
									value: crypto.createHash("sha512").update(password).digest("hex"),
								},
							},
							grade: Number(grade),
							realname: realname,
							studentId: studentId,
							loginSessions: {
								create: {
									sessionToken,
									expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 * 6), // 6 months
								},
							},
						},
					});
					const cookieStore = await cookies();
					cookieStore.set({
						name: "SESSION_TOKEN",
						value: sessionToken,
						domain: process.env.DOMAIN_SCOPE || "localhost",
						httpOnly: true,
						path: "/",
						maxAge: 60 * 60 * 24 * 30 * 6, // 6 months
					});
					redirect("/edit-profile");
				}}
			>
				<input type="text" placeholder="ユーザー名" autoComplete="username" name="username" />
				<br />
				<input type="password" placeholder="パスワード" autoComplete="new-password" name="password" />
				<br />
				<input type="text" placeholder="本名" autoComplete="name" name="realname" />
				<br />
				<input type="number" placeholder="学年（回生）" autoComplete="off" name="grade" />
				<br />
				<input type="text" placeholder="学籍番号" autoComplete="off" name="studentId" />
				<br />
				<input type="text" placeholder="登録トークン用" autoComplete="off" name="token" />
				<br />
				<button
					type="submit"
				>
					サインアップ
				</button>
			</form>
		</div >
	);

}
