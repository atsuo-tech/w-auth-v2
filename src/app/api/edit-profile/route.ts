import { initFirebaseAdmin } from "@/lib/firebase/init-admin";
import { getMe } from "@/lib/user/me";
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

export async function POST(req: NextRequest) {

	const formData = await req.formData();
	const realname = formData.get("realname") as string;
	const grade = parseInt(formData.get("grade") as string, 10);
	const username = formData.get("username") as string;

	await initFirebaseAdmin();

	const idToken = req.cookies.get("session");

	if (!idToken) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

	const user = await getMe(idToken.value);

	if (!user) {
		return NextResponse.json({ error: "Invalid session" }, { status: 401 });
	}

	await admin.firestore().collection("users").doc(user.uid).set({
		realname,
		grade,
		username: user.incomplete ? username : user.username,
	}, { merge: true });

	return NextResponse.redirect(new URL("/edit-profile?success=true", req.url));

}
