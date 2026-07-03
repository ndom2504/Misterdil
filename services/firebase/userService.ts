import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { User } from '@/types';
import { getFirebaseDb } from '@/config/firebase';
import { generateClientId } from '@/utils/format';

export interface UserProfileInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}

interface FirestoreUser extends UserProfileInput {
  clientId: string;
  balance: number;
  loyaltyPoints: number;
  phoneVerified: boolean;
  createdAt: Timestamp | ReturnType<typeof serverTimestamp>;
}

function toAppUser(uid: string, data: FirestoreUser): User {
  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : new Date().toISOString();

  return {
    id: uid,
    clientId: data.clientId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    country: data.country,
    balance: data.balance ?? 0,
    loyaltyPoints: data.loyaltyPoints ?? 0,
    phoneVerified: data.phoneVerified ?? false,
    createdAt,
  };
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(getFirebaseDb(), 'users', uid));
  if (!snap.exists()) return null;
  return toAppUser(uid, snap.data() as FirestoreUser);
}

export async function createUserProfile(
  uid: string,
  input: UserProfileInput
): Promise<User> {
  const profile: FirestoreUser = {
    ...input,
    clientId: generateClientId(),
    balance: 0,
    loyaltyPoints: 0,
    phoneVerified: false,
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(getFirebaseDb(), 'users', uid), profile);
  return toAppUser(uid, { ...profile, createdAt: Timestamp.now() });
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfileInput & { balance: number; loyaltyPoints: number; phoneVerified: boolean }>
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), 'users', uid), data);
}
