import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Package,
  Notification,
  PaymentRecord,
  TransitAddress,
  DeliveryAddress,
  DeliveryOption,
  PaymentMethod,
  PackageStatus,
} from '@/types';
import { calculateFees } from '@/utils/fees';
import { generatePackageId } from '@/utils/format';
import { isFirebaseConfigured, getFirebaseAuth } from '@/config/firebase';
import {
  onAuthStateChanged,
  signInWithEmail,
  registerWithEmail,
  signInWithGoogleIdToken,
  startPhoneVerification,
  verifyPhoneOtp,
  resendPhoneVerification,
  signOutUser,
} from '@/services/firebase/authService';
import { getUserProfile } from '@/services/firebase/userService';

const STORAGE_KEY = '@misterdil_state';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  needsPhoneVerification: boolean;
  pendingPhone: string | null;
  transitAddress: TransitAddress | null;
  packages: Package[];
  notifications: Notification[];
  payments: PaymentRecord[];
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
}

interface DeclarePackageData {
  storeName: string;
  trackingNumber: string;
  description: string;
  declaredValue: number;
  estimatedWeight: number;
}

interface AuthResponse {
  success: boolean;
  message?: string;
}

interface AppContextType extends AppState {
  isLoading: boolean;
  isFirebaseEnabled: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  loginWithGoogle: (idToken: string) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  verifyOtp: (code: string) => Promise<AuthResponse>;
  resendOtp: () => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  declarePackage: (data: DeclarePackageData) => Promise<Package>;
  updatePackageDelivery: (
    packageId: string,
    option: DeliveryOption,
    address: DeliveryAddress
  ) => Promise<void>;
  payForPackage: (packageId: string, method: PaymentMethod) => Promise<boolean>;
  markNotificationRead: (id: string) => void;
  getTransitAddressText: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function createTransitAddress(user: User): TransitAddress {
  return {
    warehouseName: 'Misterdil Warehouse',
    clientName: `${user.firstName} ${user.lastName}`,
    clientId: user.clientId,
    street: '1250 Rue Saint-Denis, Suite 458',
    city: 'Montréal',
    province: 'QC',
    postalCode: 'H2X 3J6',
    country: 'Canada',
  };
}

function createNotification(
  title: string,
  message: string,
  type: Notification['type'],
  packageId?: string
): Notification {
  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
    packageId,
  };
}

function welcomeNotifications(): Notification[] {
  return [
    createNotification(
      'Bienvenue sur Misterdil',
      'Votre adresse de transit au Canada est prête. Commencez à déclarer vos colis !',
      'success'
    ),
  ];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    isAuthenticated: false,
    needsPhoneVerification: false,
    pendingPhone: null,
    transitAddress: null,
    packages: [],
    notifications: [],
    payments: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const isFirebaseEnabled = isFirebaseConfigured();

  useEffect(() => {
    loadLocalData();
  }, []);

  useEffect(() => {
    if (!isFirebaseEnabled) return;

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (firebaseUser) => {
        if (!firebaseUser) {
          setState((prev) => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            needsPhoneVerification: false,
            pendingPhone: null,
            transitAddress: null,
          }));
          setIsLoading(false);
          return;
        }

        const profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          setIsLoading(false);
          return;
        }

        const phoneVerified = profile.phoneVerified ?? false;

        setState((prev) => ({
          ...prev,
          user: profile,
          isAuthenticated: phoneVerified,
          needsPhoneVerification: !phoneVerified,
          pendingPhone: phoneVerified ? null : profile.phone,
          transitAddress: phoneVerified ? createTransitAddress(profile) : null,
          notifications:
            phoneVerified && prev.notifications.length === 0
              ? welcomeNotifications()
              : prev.notifications,
        }));
        setIsLoading(false);
      });

    return unsubscribe;
  }, [isFirebaseEnabled]);

  useEffect(() => {
    if (!isLoading && state.isAuthenticated) {
      saveLocalData();
    }
  }, [state.packages, state.notifications, state.payments, isLoading, state.isAuthenticated]);

  async function loadLocalData() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AppState>;
        setState((prev) => ({
          ...prev,
          packages: parsed.packages ?? [],
          notifications: parsed.notifications ?? [],
          payments: parsed.payments ?? [],
        }));
      }
    } catch {
      // ignore
    } finally {
      if (!isFirebaseEnabled) {
        setIsLoading(false);
      }
    }
  }

  async function saveLocalData() {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          packages: state.packages,
          notifications: state.notifications,
          payments: state.payments,
        })
      );
    } catch {
      // ignore
    }
  }

  async function login(email: string, password: string): Promise<AuthResponse> {
    if (!isFirebaseEnabled) {
      return { success: false, message: 'Configurez Firebase dans le fichier .env' };
    }
    const result = await signInWithEmail(email, password);
    return result.ok ? { success: true } : { success: false, message: result.message };
  }

  async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
    if (!isFirebaseEnabled) {
      return { success: false, message: 'Configurez Firebase dans le fichier .env' };
    }
    const result = await signInWithGoogleIdToken(idToken);
    return result.ok ? { success: true } : { success: false, message: result.message };
  }

  async function register(data: RegisterData): Promise<AuthResponse> {
    if (!isFirebaseEnabled) {
      return { success: false, message: 'Configurez Firebase dans le fichier .env' };
    }

    const result = await registerWithEmail(data);
    if (!result.ok) {
      return { success: false, message: result.message };
    }

    setState((prev) => ({
      ...prev,
      pendingPhone: data.phone,
      needsPhoneVerification: true,
    }));

    const sms = await startPhoneVerification(data.phone);
    if (!sms.ok) {
      return {
        success: true,
        message:
          'Compte créé. SMS indisponible en Expo Go — utilisez npx expo run:android pour la vérification.',
      };
    }

    return { success: true };
  }

  async function verifyOtp(code: string): Promise<AuthResponse> {
    const phone = state.pendingPhone;
    if (!phone) {
      return { success: false, message: 'Numéro de téléphone manquant.' };
    }

    const result = await verifyPhoneOtp(code, phone);
    if (!result.ok) {
      return { success: false, message: result.message };
    }

    if (state.user) {
      const transitAddress = createTransitAddress(state.user);
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        needsPhoneVerification: false,
        pendingPhone: null,
        transitAddress,
        notifications: welcomeNotifications(),
      }));
    }

    return { success: true };
  }

  async function resendOtp(): Promise<AuthResponse> {
    if (!state.pendingPhone) {
      return { success: false, message: 'Aucun numéro en attente de vérification.' };
    }
    try {
      await resendPhoneVerification(state.pendingPhone);
      return { success: true };
    } catch (error) {
      const { getFirebaseErrorMessage } = await import('@/utils/firebaseErrors');
      return { success: false, message: getFirebaseErrorMessage(error) };
    }
  }

  async function logout(): Promise<void> {
    await signOutUser();
    await AsyncStorage.removeItem(STORAGE_KEY);
    setState({
      user: null,
      isAuthenticated: false,
      needsPhoneVerification: false,
      pendingPhone: null,
      transitAddress: null,
      packages: [],
      notifications: [],
      payments: [],
    });
  }

  async function updateProfile(data: Partial<User>): Promise<void> {
    setState((prev) => {
      if (!prev.user) return prev;
      const user = { ...prev.user, ...data };
      return {
        ...prev,
        user,
        transitAddress: prev.transitAddress
          ? { ...prev.transitAddress, clientName: `${user.firstName} ${user.lastName}` }
          : null,
      };
    });
  }

  async function declarePackage(data: DeclarePackageData): Promise<Package> {
    const pkg: Package = {
      id: generatePackageId(),
      trackingNumber: data.trackingNumber,
      storeName: data.storeName,
      description: data.description,
      declaredValue: data.declaredValue,
      estimatedWeight: data.estimatedWeight,
      status: 'declared',
      photos: {},
      invoicePhotos: [],
      declaredAt: new Date().toISOString(),
      paymentStatus: 'pending',
    };

    setState((prev) => ({
      ...prev,
      packages: [pkg, ...prev.packages],
      notifications: [
        createNotification(
          'Colis déclaré',
          `Votre colis ${data.storeName} a été enregistré. En attente de réception au Canada.`,
          'info',
          pkg.id
        ),
        ...prev.notifications,
      ],
    }));

    return pkg;
  }

  async function updatePackageDelivery(
    packageId: string,
    option: DeliveryOption,
    address: DeliveryAddress
  ): Promise<void> {
    setState((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg) => {
        if (pkg.id !== packageId) return pkg;
        const weight = pkg.actualWeight ?? pkg.estimatedWeight;
        const fees = calculateFees({
          weightKg: weight,
          declaredValue: pkg.declaredValue,
          destinationCountry: address.country === 'Cameroun' ? 'CM' : 'DEFAULT',
          deliveryOption: option,
        });
        return { ...pkg, deliveryOption: option, deliveryAddress: address, fees };
      }),
    }));
  }

  async function payForPackage(packageId: string, method: PaymentMethod): Promise<boolean> {
    const pkg = state.packages.find((p) => p.id === packageId);
    if (!pkg?.fees) return false;

    const payment: PaymentRecord = {
      id: `pay_${Date.now()}`,
      packageId,
      amount: pkg.fees.total,
      method,
      status: 'paid',
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      packages: prev.packages.map((p) =>
        p.id === packageId
          ? { ...p, paymentStatus: 'paid' as const, status: advanceStatus(p.status) }
          : p
      ),
      payments: [payment, ...prev.payments],
      user: prev.user
        ? { ...prev.user, loyaltyPoints: prev.user.loyaltyPoints + 100 }
        : null,
      notifications: [
        createNotification(
          'Paiement confirmé',
          `Paiement de ${pkg.fees!.total} $ effectué. Votre colis sera expédié sous peu.`,
          'success',
          packageId
        ),
        ...prev.notifications,
      ],
    }));

    return true;
  }

  function advanceStatus(current: PackageStatus): PackageStatus {
    const order: PackageStatus[] = ['received', 'preparing', 'shipped'];
    const idx = order.indexOf(current);
    return idx >= 0 && idx < order.length - 1 ? order[idx + 1] : current;
  }

  function markNotificationRead(id: string) {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  }

  function getTransitAddressText(): string {
    if (!state.transitAddress) return '';
    const a = state.transitAddress;
    return [
      a.warehouseName,
      `Nom du client : ${a.clientName}`,
      `ID Client : ${a.clientId}`,
      a.street,
      `${a.city}, ${a.province} ${a.postalCode}`,
      a.country,
    ].join('\n');
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        isLoading,
        isFirebaseEnabled,
        login,
        loginWithGoogle,
        register,
        verifyOtp,
        resendOtp,
        logout,
        updateProfile,
        declarePackage,
        updatePackageDelivery,
        payForPackage,
        markNotificationRead,
        getTransitAddressText,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
