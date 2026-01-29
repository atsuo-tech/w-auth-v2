import { initFirebaseAdmin } from "@/lib/firebase/init-admin";
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

export async function GET(req: NextRequest) {

	await initFirebaseAdmin();

	const idToken = req.cookies.get("session")?.value || "";

	await admin.auth().revokeRefreshTokens(idToken).catch((_err) => { });

	const response = NextResponse.redirect(new URL("/login", req.url));

	response.cookies.delete("session");

	return response;

}
