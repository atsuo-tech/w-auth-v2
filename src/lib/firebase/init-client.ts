import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { firebaseConfig } from "@/lib/firebase/config";

export default function initFirebaseClient() {

	if (!firebase.apps.length) {
		return firebase.initializeApp(firebaseConfig);
	}

	return firebase.app();

}

