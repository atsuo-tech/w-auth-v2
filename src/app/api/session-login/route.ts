import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { initFirebaseAdmin } from "@/lib/firebase/init-admin";
import { getMe } from "@/lib/user/me";

const SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 days in seconds

export async function POST(req: NextRequest) {

	await initFirebaseAdmin();

	try {

		const { idToken } = await req.json();

		if (!idToken) {
			return NextResponse.json({ error: "No ID token provided" }, { status: 400 });
		}

		const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE * 1000 });

		const meData = await getMe(idToken);

		const firstLogin = meData ? false : true;

		const response = NextResponse.json({
			status: "success",
			user: meData,
			firstLogin,
			redirectTo: firstLogin ? "/edit-profile" : "/",
		});
		response.cookies.set("session", sessionCookie, { httpOnly: true, maxAge: SESSION_MAX_AGE, domain: process.env.DOMAIN_SCOPE || undefined, secure: true, path: "/" });

		return response;

	} catch (err) {

		console.error(err);
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });

	}

}
