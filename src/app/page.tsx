import { getMe } from "@/lib/user/me";
import styles from "./page.module.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {

  const cookieStore = await cookies();

  const user = await getMe(cookieStore.get("session")?.value || "");

  if (!user) {
    redirect("/login");
  }

  if(user.incomplete) {
    redirect("/edit-profile");
  }

  return (
    <div className={styles.page}>

      <h1>W-Auth</h1>

      <p>
        こんにちは。<br />
        あなたは {user.username} ({user.realname}) です。
      </p>

      <h2>リンク</h2>

      <ul>
        <li>
          <a href="/edit-profile">情報の編集</a>
        </li>
        <li>
          <a href="https://judge.w-pcp.dev">AtsuoCoder</a>
        </li>
      </ul>

    </div>
  );

}
