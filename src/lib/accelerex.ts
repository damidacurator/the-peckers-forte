// Accelerex (RexPay) Gateway Integration & Bank Utilities

export interface AccelerexConfig {
  environment: 'sandbox' | 'production';
  merchantId: string;
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
  sandboxUrl: string;
  productionUrl: string;
  settlementBank: string;
  settlementAccount: string;
  settlementAccountName: string;
}

export interface Bank {
  code: string;
  name: string;
  slug: string;
}

export const NIGERIAN_BANKS: Bank[] = [
  { code: '044', name: 'Access Bank', slug: 'access-bank' },
  { code: '023', name: 'Citibank Nigeria', slug: 'citibank-nigeria' },
  { code: '050', name: 'Ecobank Nigeria', slug: 'ecobank-nigeria' },
  { code: '070', name: 'Fidelity Bank', slug: 'fidelity-bank' },
  { code: '011', name: 'First Bank of Nigeria', slug: 'first-bank-of-nigeria' },
  { code: '214', name: 'First City Monument Bank (FCMB)', slug: 'fcmb' },
  { code: '058', name: 'Guaranty Trust Bank (GTBank)', slug: 'guaranty-trust-bank' },
  { code: '030', name: 'Heritage Bank', slug: 'heritage-bank' },
  { code: '301', name: 'Jaiz Bank', slug: 'jaiz-bank' },
  { code: '082', name: 'Keystone Bank', slug: 'keystone-bank' },
  { code: '50211', name: 'Kuda Microfinance Bank', slug: 'kuda-bank' },
  { code: '50515', name: 'Moniepoint Microfinance Bank', slug: 'moniepoint' },
  { code: '999992', name: 'OPay Digital Services', slug: 'opay' },
  { code: '999991', name: 'PalmPay', slug: 'palmpay' },
  { code: '076', name: 'Polaris Bank', slug: 'polaris-bank' },
  { code: '101', name: 'Providus Bank', slug: 'providus-bank' },
  { code: '221', name: 'Stanbic IBTC Bank', slug: 'stanbic-ibtc-bank' },
  { code: '068', name: 'Standard Chartered Bank', slug: 'standard-chartered-bank' },
  { code: '232', name: 'Sterling Bank', slug: 'sterling-bank' },
  { code: '100', name: 'SunTrust Bank', slug: 'suntrust-bank' },
  { code: '032', name: 'Union Bank of Nigeria', slug: 'union-bank-of-nigeria' },
  { code: '033', name: 'United Bank for Africa (UBA)', slug: 'united-bank-for-africa' },
  { code: '215', name: 'Unity Bank', slug: 'unity-bank' },
  { code: '035', name: 'Wema Bank / ALAT', slug: 'wema-bank' },
  { code: '057', name: 'Zenith Bank', slug: 'zenith-bank' },
];

export const DEFAULT_CONFIG: AccelerexConfig = {
  environment: 'sandbox',
  merchantId: 'REX-TPF-DEMO',
  publicKey: 'rx_pub_test_88f9e02c77a1bc',
  secretKey: 'rx_sec_test_99a8b7c6d5e4f3a2b1',
  webhookSecret: 'whsec_test_77c8e9a0b1c2',
  sandboxUrl: 'https://pgs-sandbox.globalaccelerex.com',
  productionUrl: 'https://pgs.globalaccelerex.com',
  settlementBank: '058',
  settlementAccount: '0123456789',
  settlementAccountName: 'THE PECKERS FORTE COOPERATIVE LTD',
};

const STORAGE_KEY = 'tpf_accelerex_config';
const TRANSACTIONS_KEY = 'tpf_accelerex_transactions';
const TRANSFERS_KEY = 'tpf_accelerex_transfers';

export function getGatewayConfig(): AccelerexConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
  } catch (e) {
    console.error('Failed to load gateway config:', e);
  }
  return DEFAULT_CONFIG;
}

export function saveGatewayConfig(config: AccelerexConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save gateway config:', e);
  }
}

export interface GatewayTransaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  type: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: 'card' | 'transfer' | 'ussd';
  status: 'successful' | 'pending' | 'failed';
  environment: 'sandbox' | 'production';
  channel: string;
  createdAt: string;
  paidAt?: string;
  receiptNumber?: string;
}

export interface GatewayTransfer {
  id: string;
  reference: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  narration: string;
  status: 'successful' | 'pending' | 'failed';
  environment: 'sandbox' | 'production';
  fee: number;
  createdAt: string;
}

export function getStoredTransactions(): GatewayTransaction[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return [];
}

export function saveTransaction(tx: GatewayTransaction): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredTransactions();
    const updated = [tx, ...list.filter(t => t.id !== tx.id)];
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
  } catch (e) {}
}

export function getStoredTransfers(): GatewayTransfer[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(TRANSFERS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return [];
}

export function saveTransfer(transfer: GatewayTransfer): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredTransfers();
    const updated = [transfer, ...list.filter(t => t.id !== transfer.id)];
    localStorage.setItem(TRANSFERS_KEY, JSON.stringify(updated));
  } catch (e) {}
}

// Simulate NUBAN Account Name Resolution
export async function resolveAccountName(accountNumber: string, bankCode: string): Promise<{ success: boolean; accountName?: string; message?: string }> {
  await new Promise(r => setTimeout(r, 600)); // Network delay
  
  if (accountNumber.length !== 10) {
    return { success: false, message: 'Account number must be exactly 10 digits' };
  }

  const bank = NIGERIAN_BANKS.find(b => b.code === bankCode);
  if (!bank) {
    return { success: false, message: 'Invalid bank selected' };
  }

  const mockNames = [
    'THE PECKERS FORTE ALLIANCE PORTFOLIO',
    'AKINOLA IDOWU',
    'OYINDAMOLA IDOWU',
    'OLUWADAMILARE IDOWU',
    'PREMIER MULTIPURPOSE COOPERATIVE',
    'CHUKWUEMEKA OBIOMA',
    'ADEKUNLE BABATUNDE'
  ];

  const index = Math.abs(accountNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % mockNames.length;
  return {
    success: true,
    accountName: mockNames[index]
  };
}

// Simulate Testing API Connection
export async function testApiConnection(config: AccelerexConfig): Promise<{ success: boolean; latencyMs: number; message: string; details: any }> {
  const startTime = Date.now();
  await new Promise(r => setTimeout(r, 750));
  const latency = Date.now() - startTime;

  if (!config.publicKey || config.publicKey.trim().length < 8) {
    return {
      success: false,
      latencyMs: latency,
      message: 'Invalid Public API Key format. Must start with rx_pub_ or similar.',
      details: { status: 401, error: 'Unauthorized: Missing or malformed Public Key' }
    };
  }

  if (!config.secretKey || config.secretKey.trim().length < 8) {
    return {
      success: false,
      latencyMs: latency,
      message: 'Invalid Secret API Key. Please provide a valid private authorization key.',
      details: { status: 401, error: 'Unauthorized: Invalid Secret Key' }
    };
  }

  return {
    success: true,
    latencyMs: latency,
    message: 'Connected successfully to Accelerex (' + config.environment.toUpperCase() + ') Gateway!',
    details: {
      provider: 'Global Accelerex / RexPay',
      environment: config.environment,
      merchantId: config.merchantId,
      endpoint: config.environment === 'production' ? config.productionUrl : config.sandboxUrl,
      features: ['card_collection', 'bank_transfer', 'ussd', 'account_inquiry', 'payout_transfers'],
      timestamp: new Date().toISOString()
    }
  };
}
