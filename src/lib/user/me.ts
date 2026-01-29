import { redirect } from "next/navigation";
import { initFirebaseAdmin } from "../firebase/init-admin";
import admin from "firebase-admin";

export interface Me {
	uid: string;
	username: string;
	grade: number;
	realname: string;
	incomplete: false;
}

export interface IncompleteMe {
	uid: string;
	incomplete: true;
}

export async function getMe(idToken: string): Promise<Me | IncompleteMe | null> {

	await initFirebaseAdmin();

	const decoded = await (async () => {
		try {
			return await admin.auth().verifySessionCookie(idToken);
		} catch (err) {
			return null;
		}
	})();

	if (!decoded)
		return null;

	const db = admin.firestore();

	const userDoc = await db.collection("users").doc(decoded.uid).get();
	const userData = userDoc.data();

	if (!userData)
		return { uid: decoded.uid, incomplete: true } as IncompleteMe;

	return {
		uid: decoded.uid,
		...userData,
		incomplete: false,
	} as Me;

}
