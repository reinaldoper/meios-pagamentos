
import { Wallet } from "@/app/types/types";
import { auth, db } from "./firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

const userRef = auth.currentUser;

export async function getUserWallet(uid: string) {
  const walletRef = doc(db, "wallets", uid);
  const walletSnap = await getDoc(walletRef);

  if (walletSnap.exists()) {
    return walletSnap.data();
  } else {
    await setDoc(walletRef, { uid, balance: 0 });
    return { uid, balance: 0 };
  }
}

export async function getAllWallets() {
  const snapshot = await getDocs(collection(db, "wallets"));
  return snapshot.docs.map((doc) => doc.data()) as Wallet[];
}

export async function getUser() {
  if (!userRef?.uid) {
    throw new Error("Usuário não autenticado.");
  }
  const userDoc = doc(db, "users", userRef.uid);
  const userSnap = await getDoc(userDoc);
  if (!userSnap.exists()) {
    throw new Error("Usuário nao encontrado.");
  }
  const userData = userSnap.data();
  return {
    uid: userRef?.uid,
    email: userRef?.email,
    role: userData.role || "user",
    createdAt: userRef?.metadata?.creationTime
      ? new Date(userRef.metadata.creationTime)
      : null,
  };
}

export async function getUserWalletBalance(uid: string) {
  const userDoc = doc(db, "users", uid);
  const userSnap = await getDoc(userDoc);
  if (!userSnap.exists()) {
    throw new Error(`Usuário ${uid} nao encontrado.`);
  }
  const userData = userSnap.data();
  return {
    uid: userData?.uid,
    email: userData?.email,
    role: userData.role || "user",
    createdAt: userData?.metadata?.creationTime
      ? new Date(userData.metadata.creationTime)
      : null,
  };
}

export async function updateWalletBalance(uid: string, balance: number) {
  const walletRef = doc(db, "wallets", uid);
  await updateDoc(walletRef, { balance });
}

export async function createPaymentRequest(
  amount: number,
  description: string
) {
  try {
    const ref = collection(db, "payment_requests");
    const docRef = await addDoc(ref, {
      uid: userRef?.uid,
      amount,
      description,
      status: "pending",
      createdAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error: Error | unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Ocorreu um erro."
    );
  }
}

export async function getUserPaymentRequests(uid: string) {
  try {
    const userDoc = doc(db, "users", uid);
    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      throw new Error("Usuário não encontrado.");
    }

    const userData = userSnap.data();
    const isAdmin = userData.role === "admin";
    console.log(isAdmin);
    

    const ref = collection(db, "payment_requests");
    const q = isAdmin
      ? query(ref, orderBy("createdAt", "desc"))
      : query(ref, where("uid", "==", uid), orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docPayment) => ({
      id: docPayment.id,
      ...docPayment.data(),
    })) as {
      id: string;
      amount: number;
      description: string;
      status: string;
      createdAt: { seconds: number; nanoseconds: number };
    }[];
  } catch (error: Error | unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Ocorreu um erro."
    );
  }
}


export async function updatePaymentRequestStatus(
  requestId: string,
  status: string
) {
  const requestRef = doc(db, "payment_requests", requestId);
  await updateDoc(requestRef, { status });
}
