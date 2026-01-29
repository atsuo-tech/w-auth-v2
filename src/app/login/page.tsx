"use client";

import initFirebaseClient from "@/lib/firebase/init-client";
import firebase from "firebase/compat/app";

export default function LoginUI() {

	return (
		<div>
			<h1>ログイン</h1>
			<button
				onClick={async () => {
					initFirebaseClient();
					const provider = new firebase.auth.GoogleAuthProvider();
					try {
						const result = await firebase.auth().signInWithPopup(provider);
						const user = result.user;
						if (!user) throw new Error("No user info");
						const idToken = await user.getIdToken();

						fetch("/api/session-login", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ idToken }),
						}).then((res) => res.json()).then((data) => {

							window.location.href = data.redirectTo || "/";

						});

					} catch (error) {
						console.error("Error during sign-in:", error);
					}
				}}
			>
				Google でログイン
			</button>
		</div>
	);

}
