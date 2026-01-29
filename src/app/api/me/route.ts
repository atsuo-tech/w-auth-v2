import { NextRequest, NextResponse } from "next/server";
import { initFirebaseAdmin } from "@/lib/firebase/init-admin";
import { getMe } from "@/lib/user/me";

export async function GET(req: NextRequest) {

	await initFirebaseAdmin();

	const idToken = req.cookies.get("session");

	if (!idToken) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

	const user = await getMe(idToken.value);

	if (!user) {
		return NextResponse.json({ error: "Invalid session" }, { status: 401 });
	}

	return NextResponse.json({ user });

}
