import { getCurrentUser } from "@/lib/user";
import styles from "./page.module.css";
import { redirect } from "next/navigation";

export default async function Home() {

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.grade == -1) {
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
        <li>
          <a href="/logout">ログアウト</a>
        </li>
      </ul>

    </div>
  );

}
