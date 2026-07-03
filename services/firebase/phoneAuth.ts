export async function sendPhoneVerification(_phone: string): Promise<void> {
  throw new Error(
    'La vérification SMS nécessite un build Android natif (npx expo run:android).'
  );
}

export async function confirmPhoneVerification(_code: string): Promise<void> {
  throw new Error('Vérification SMS indisponible dans Expo Go.');
}

export async function resendPhoneVerification(_phone: string): Promise<void> {
  throw new Error('Renvoi SMS indisponible dans Expo Go.');
}

export function isNativePhoneAuthAvailable(): boolean {
  return false;
}
