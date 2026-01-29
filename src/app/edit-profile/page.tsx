import { getMe, Me } from "@/lib/user/me";
import { cookies } from "next/headers";
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

	const cookieStore = await cookies();
	const user = await getMe(cookieStore.get("session")?.value || "") as Me;

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
				method="POST"
				action="/api/edit-profile"
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
					ユーザー名（変更不可）
					<br />
					<input type="text" name="username" defaultValue={user?.username || ""} disabled={!user.incomplete} />
				</label>
				<br />
				<br />
				<button type="submit">更新</button>
			</form>

			<br />

			<a href="/">ホームに戻る</a>

		</div>
	)

}
