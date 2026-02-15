import { getCurrentUser } from "@/lib/user";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import Link from "next/link";

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

      <h1>Welcome to W-Auth</h1>

      <p>
        こんにちは。<br />
        あなたは {user.username} ({user.realname}) です。
      </p>

      <h2>リンク</h2>

      <ul>
        <li>
          <Link href="/edit-profile">情報の編集</Link>
        </li>
        <li>
          <Link href="https://judge.w-pcp.dev">AtsuoCoder</Link>
        </li>
        <li>
          <Link href="/logout">ログアウト</Link>
        </li>
      </ul>

    </div>
  );

}
