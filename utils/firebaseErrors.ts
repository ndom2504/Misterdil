export function getFirebaseErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: string }).code)
      : '';

  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'Cet email est déjà utilisé.',
    'auth/invalid-email': 'Adresse email invalide.',
    'auth/weak-password': 'Mot de passe trop faible (minimum 6 caractères).',
    'auth/user-not-found': 'Aucun compte avec cet email.',
    'auth/wrong-password': 'Mot de passe incorrect.',
    'auth/invalid-credential': 'Email ou mot de passe incorrect.',
    'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
    'auth/invalid-verification-code': 'Code SMS incorrect.',
    'auth/code-expired': 'Code expiré. Demandez un nouveau SMS.',
    'auth/invalid-phone-number': 'Numéro de téléphone invalide.',
    'auth/missing-phone-number': 'Numéro de téléphone requis.',
    'auth/credential-already-in-use': 'Ce numéro est déjà associé à un compte.',
    'auth/network-request-failed': 'Erreur réseau. Vérifiez votre connexion.',
  };

  if (messages[code]) return messages[code];

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Une erreur est survenue. Réessayez.';
}
