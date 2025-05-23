import { Wallet } from "@/app/types/types";
import { auth, db } from "./firebase";
import {
  addDoc,
  collection,
  deleteDoc,
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

export async function updateWalletBalance(
  uid: string,
  valueToSubtract: number
) {
  if (!userRef?.uid) {
    throw new Error("Usuário não autenticado.");
  }
  const walletRef = doc(db, "wallets", uid);
  const walletSnap = await getDoc(walletRef);

  if (!walletSnap.exists()) {
    throw new Error("Carteira não encontrada.");
  }

  const walletData = walletSnap.data();

  if (walletData.balance < valueToSubtract) {
    return false;
  }

  const newBalance = walletData.balance - valueToSubtract;

  await updateDoc(walletRef, { balance: newBalance });
  return true;
}

export async function createPaymentRequest(
  amount: number,
  description: string
) {
  try {
    if (!userRef?.uid) {
      throw new Error("Usuário não autenticado.");
    }
    const balance = await getUserWallet(userRef?.uid);
    if (balance.balance < amount) {
      throw new Error("Saldo insuficiente.");
    } else {
      const ref = collection(db, "payment_requests");
      const docRef = await addDoc(ref, {
        uid: userRef?.uid,
        amount,
        description,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      return docRef.id;
    }
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
      uid: string;
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

export async function createWallet(newBalance: number = 0) {
  if (!userRef?.uid) {
    throw new Error("Usuário nao autenticado.");
  }
  const balance = await getUserWallet(userRef?.uid);
  const createBalance = balance.balance += newBalance;
  const walletRef = doc(db, "wallets", userRef?.uid);
  
  await setDoc(walletRef, {
    uid: userRef?.uid,
    balance: createBalance,
    createdAt: Timestamp.now(),
  });
}

export async function getPaymentRequests(uid: string) {
  if (!userRef?.uid) {
    throw new Error("Usuário nao autenticado.");
  }

  const paymentRef = doc(db, "payment_requests", uid);
  return paymentRef;
}

export async function deletePaymentRequest(requestId: string) {
  if (!userRef?.uid) {
    throw new Error("Usuário nao autenticado.");
  }
  try {
    const requestRef = doc(db, "payment_requests", requestId);
    await deleteDoc(requestRef);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Ocorreu um erro."
    );
  }
}
