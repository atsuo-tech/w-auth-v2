"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditProfile(
	{
		searchParams,
	}: {
		searchParams: Promise<{
			success?: string;
		}>
	}
) {

	const { success } = await searchParams;

	const user = await getCurrentUser();

	if (!user) {
		redirect("/login");
	}

	return (
		<div>

			<h1>情報の編集</h1>

			{success === "true" && (
				<p style={{ color: "green" }}>
					プロフィールが更新されました。
				</p>
			)}

			<form
				action={
					async (formData: FormData) => {

						const realname = formData.get("realname")?.toString().trim() || "";
						const grade = formData.get("grade")?.toString().trim() || "";
						const studentId = formData.get("studentId")?.toString().trim() || "";

						if (typeof grade !== "string" || isNaN(Number(grade)) || Number(grade) < 1) {
							redirect("/edit-profile?success=false");
						}

						if (typeof studentId !== "string" || isNaN(Number(studentId)) || Number(studentId) < 1) {
							redirect("/edit-profile?success=false");
						}

						const user = await getCurrentUser();
						await db.authUser.update({
							where: {
								uniqueId: user!.uniqueId,
							},
							data: {
								realname: realname,
								grade: Number(grade),
								studentId: studentId,
							},
						});

						redirect("/edit-profile?success=true");

					}
				}
			>
				<label>
					本名（空白なし）
					<br />
					<input type="text" name="realname" defaultValue={user?.realname || ""} />
				</label>
				<br />
				<label>
					学年（回生）
					<br />
					<input type="number" name="grade" defaultValue={user?.grade || ""} />
				</label>
				<br />
				<label>
					学籍番号
					<br />
					<input type="text" name="studentId" defaultValue={user?.studentId || ""} />
				</label>
				<br />
				<label>
					ユーザー名（変更不可）
					<br />
					<input type="text" name="username" defaultValue={user?.username || ""} disabled />
				</label>
				<br />
				<br />
				<button type="submit">更新</button>
			</form>

			<br />

			<Link href="/">ホームに戻る</Link>

		</div>
	)

}
