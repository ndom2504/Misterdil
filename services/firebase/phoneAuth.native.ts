import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

let phoneConfirmation: FirebaseAuthTypes.ConfirmationResult | null = null;

export async function sendPhoneVerification(phone: string): Promise<void> {
  const auth = require('@react-native-firebase/auth').default;
  const user = auth().currentUser;

  if (!user) {
    throw new Error('Connectez-vous avant de vérifier votre téléphone.');
  }

  phoneConfirmation = await user.linkWithPhoneNumber(phone);
}

export async function confirmPhoneVerification(code: string): Promise<void> {
  if (!phoneConfirmation) {
    throw new Error('Aucune vérification SMS en cours. Renvoyez le code.');
  }

  await phoneConfirmation.confirm(code);
  phoneConfirmation = null;
}

export async function resendPhoneVerification(phone: string): Promise<void> {
  await sendPhoneVerification(phone);
}

export function isNativePhoneAuthAvailable(): boolean {
  try {
    require('@react-native-firebase/auth');
    return true;
  } catch {
    return false;
  }
}
