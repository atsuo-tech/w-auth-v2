import admin from "firebase-admin";

export async function initFirebaseAdmin() {

  if (!admin.apps.length) {
    return admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  return admin.app();

}
