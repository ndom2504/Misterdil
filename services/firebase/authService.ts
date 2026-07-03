import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from '@/config/firebase';
import { createUserProfile, getUserProfile, updateUserProfile } from './userService';
import { UserProfileInput } from './userService';
import {
  sendPhoneVerification,
  confirmPhoneVerification,
  resendPhoneVerification,
} from './phoneAuth';

export type AuthResult = { ok: true } | { ok: false; message: string };

export { onAuthStateChanged, sendPhoneVerification, confirmPhoneVerification, resendPhoneVerification };

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!isFirebaseConfigured()) {
    return { ok: false, message: 'Firebase non configuré.' };
  }
  try {
    await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
    return { ok: true };
  } catch (error) {
    const { getFirebaseErrorMessage } = await import('@/utils/firebaseErrors');
    return { ok: false, message: getFirebaseErrorMessage(error) };
  }
}

export async function registerWithEmail(
  input: UserProfileInput & { password: string }
): Promise<AuthResult> {
  if (!isFirebaseConfigured()) {
    return { ok: false, message: 'Firebase non configuré.' };
  }
  try {
    const credential = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      input.email.trim(),
      input.password
    );

    await updateProfile(credential.user, {
      displayName: `${input.firstName} ${input.lastName}`.trim(),
    });

    await createUserProfile(credential.user.uid, {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.trim(),
      phone: input.phone,
      country: input.country,
    });

    return { ok: true };
  } catch (error) {
    const { getFirebaseErrorMessage } = await import('@/utils/firebaseErrors');
    return { ok: false, message: getFirebaseErrorMessage(error) };
  }
}

export async function signInWithGoogleIdToken(idToken: string): Promise<AuthResult> {
  if (!isFirebaseConfigured()) {
    return { ok: false, message: 'Firebase non configuré.' };
  }
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(getFirebaseAuth(), credential);

    const existing = await getUserProfile(result.user.uid);
    if (!existing) {
      const [firstName = '', ...rest] = (result.user.displayName ?? 'Utilisateur').split(' ');
      await createUserProfile(result.user.uid, {
        firstName,
        lastName: rest.join(' '),
        email: result.user.email ?? '',
        phone: result.user.phoneNumber ?? '',
        country: 'Cameroun',
      });
    }

    return { ok: true };
  } catch (error) {
    const { getFirebaseErrorMessage } = await import('@/utils/firebaseErrors');
    return { ok: false, message: getFirebaseErrorMessage(error) };
  }
}

export async function verifyPhoneOtp(code: string, phone: string): Promise<AuthResult> {
  try {
    await confirmPhoneVerification(code);
    const uid = getFirebaseAuth().currentUser?.uid;
    if (uid) {
      await updateUserProfile(uid, { phone, phoneVerified: true });
    }
    return { ok: true };
  } catch (error) {
    const { getFirebaseErrorMessage } = await import('@/utils/firebaseErrors');
    return { ok: false, message: getFirebaseErrorMessage(error) };
  }
}

export async function startPhoneVerification(phone: string): Promise<AuthResult> {
  try {
    await sendPhoneVerification(phone);
    return { ok: true };
  } catch (error) {
    const { getFirebaseErrorMessage } = await import('@/utils/firebaseErrors');
    return { ok: false, message: getFirebaseErrorMessage(error) };
  }
}

export async function signOutUser(): Promise<void> {
  if (isFirebaseConfigured()) {
    await firebaseSignOut(getFirebaseAuth());
  }
}
