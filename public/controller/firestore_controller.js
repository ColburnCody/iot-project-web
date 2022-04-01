import {
	getFirestore, onSnapshot, doc, setDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"

import * as Constants from '../model/constants.js'

const db = getFirestore();

export async function initFirestoreDocs() {
	await setDoc(doc(db, Constants.COLLECTION, Constants.DOC_RINOSAS), Constants.docRINOSAS);
}

export async function updateDocForTreats(update) {
	const docRef = doc(db, Constants.COLLECTION, Constants.DOC_RINOSAS);
	await updateDoc(docRef, update);
}

export function attachRealtimeListener(collection, document, callback) {
	const unsubscribeListener = onSnapshot(doc(db, collection, document), callback);
	return unsubscribeListener;
}