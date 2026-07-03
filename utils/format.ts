export function formatCurrency(amount: number, currency = 'CAD'): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-CA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function formatTransitAddress(address: {
  warehouseName: string;
  clientName: string;
  clientId: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}): string {
  return [
    address.warehouseName,
    `Nom du client : ${address.clientName}`,
    `ID Client : ${address.clientId}`,
    address.street,
    `${address.city}, ${address.province} ${address.postalCode}`,
    address.country,
  ].join('\n');
}

export function generateClientId(): string {
  return `MD-${Math.floor(10000 + Math.random() * 90000)}`;
}

export function generatePackageId(): string {
  return `PKG-${Date.now().toString(36).toUpperCase()}`;
}
