export interface CurrencyConfig {
    code: string
    symbol: string
    name: string
    country: string
    taxName: string
    defaultTaxRate: number
    locale: string
}

export const CURRENCIES: CurrencyConfig[] = [
    { code: "INR", symbol: "₹", name: "Indian Rupee", country: "India", taxName: "GST", defaultTaxRate: 18, locale: "en-IN" },
    { code: "USD", symbol: "$", name: "US Dollar", country: "United States", taxName: "Sales Tax", defaultTaxRate: 8, locale: "en-US" },
    { code: "EUR", symbol: "€", name: "Euro", country: "Germany", taxName: "VAT", defaultTaxRate: 19, locale: "de-DE" },
    { code: "EUR", symbol: "€", name: "Euro", country: "France", taxName: "VAT", defaultTaxRate: 20, locale: "fr-FR" },
    { code: "EUR", symbol: "€", name: "Euro", country: "Spain", taxName: "VAT", defaultTaxRate: 21, locale: "es-ES" },
    { code: "EUR", symbol: "€", name: "Euro", country: "Italy", taxName: "VAT", defaultTaxRate: 22, locale: "it-IT" },
    { code: "GBP", symbol: "£", name: "British Pound", country: "United Kingdom", taxName: "VAT", defaultTaxRate: 20, locale: "en-GB" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "Australia", taxName: "GST", defaultTaxRate: 10, locale: "en-AU" },
    { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", country: "New Zealand", taxName: "GST", defaultTaxRate: 15, locale: "en-NZ" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar", country: "Canada", taxName: "GST/HST", defaultTaxRate: 13, locale: "en-CA" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen", country: "Japan", taxName: "Consumption Tax", defaultTaxRate: 10, locale: "ja-JP" },
    { code: "KRW", symbol: "₩", name: "South Korean Won", country: "South Korea", taxName: "VAT", defaultTaxRate: 10, locale: "ko-KR" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar", country: "Singapore", taxName: "GST", defaultTaxRate: 9, locale: "en-SG" },
    { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", country: "Malaysia", taxName: "SST", defaultTaxRate: 10, locale: "ms-MY" },
    { code: "THB", symbol: "฿", name: "Thai Baht", country: "Thailand", taxName: "VAT", defaultTaxRate: 7, locale: "th-TH" },
    { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", country: "Indonesia", taxName: "VAT", defaultTaxRate: 11, locale: "id-ID" },
    { code: "PHP", symbol: "₱", name: "Philippine Peso", country: "Philippines", taxName: "VAT", defaultTaxRate: 12, locale: "en-PH" },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham", country: "United Arab Emirates", taxName: "VAT", defaultTaxRate: 5, locale: "ar-AE" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal", country: "Saudi Arabia", taxName: "VAT", defaultTaxRate: 15, locale: "ar-SA" },
    { code: "QAR", symbol: "﷼", name: "Qatari Riyal", country: "Qatar", taxName: "VAT", defaultTaxRate: 5, locale: "ar-QA" },
    { code: "TRY", symbol: "₺", name: "Turkish Lira", country: "Turkey", taxName: "VAT", defaultTaxRate: 20, locale: "tr-TR" },
    { code: "CHF", symbol: "CHF", name: "Swiss Franc", country: "Switzerland", taxName: "VAT", defaultTaxRate: 8.1, locale: "de-CH" },
    { code: "NOK", symbol: "kr", name: "Norwegian Krone", country: "Norway", taxName: "VAT", defaultTaxRate: 25, locale: "no-NO" },
    { code: "SEK", symbol: "kr", name: "Swedish Krona", country: "Sweden", taxName: "VAT", defaultTaxRate: 25, locale: "sv-SE" },
    { code: "DKK", symbol: "kr", name: "Danish Krone", country: "Denmark", taxName: "VAT", defaultTaxRate: 25, locale: "da-DK" },
    { code: "PLN", symbol: "zł", name: "Polish Zloty", country: "Poland", taxName: "VAT", defaultTaxRate: 23, locale: "pl-PL" },
    { code: "CZK", symbol: "Kč", name: "Czech Koruna", country: "Czech Republic", taxName: "VAT", defaultTaxRate: 21, locale: "cs-CZ" },
    { code: "HUF", symbol: "Ft", name: "Hungarian Forint", country: "Hungary", taxName: "VAT", defaultTaxRate: 27, locale: "hu-HU" },
    { code: "BRL", symbol: "R$", name: "Brazilian Real", country: "Brazil", taxName: "ICMS/VAT", defaultTaxRate: 18, locale: "pt-BR" },
    { code: "MXN", symbol: "$", name: "Mexican Peso", country: "Mexico", taxName: "VAT", defaultTaxRate: 16, locale: "es-MX" },
    { code: "ARS", symbol: "$", name: "Argentine Peso", country: "Argentina", taxName: "VAT", defaultTaxRate: 21, locale: "es-AR" },
    { code: "ZAR", symbol: "R", name: "South African Rand", country: "South Africa", taxName: "VAT", defaultTaxRate: 15, locale: "en-ZA" },
    { code: "NGN", symbol: "₦", name: "Nigerian Naira", country: "Nigeria", taxName: "VAT", defaultTaxRate: 7.5, locale: "en-NG" },
    { code: "EGP", symbol: "£", name: "Egyptian Pound", country: "Egypt", taxName: "VAT", defaultTaxRate: 14, locale: "ar-EG" },
    { code: "KES", symbol: "KSh", name: "Kenyan Shilling", country: "Kenya", taxName: "VAT", defaultTaxRate: 16, locale: "en-KE" },
];

const CURRENCY_STORAGE_KEY = "expense_zap_currency";

export const getSavedCurrency = (): CurrencyConfig => {
    if (typeof window === "undefined") return CURRENCIES[0];
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (saved) {
        // Match by "code:country" for unique identification (since EUR has multiple countries)
        const [code, country] = saved.split(":");
        const found = CURRENCIES.find((c) => c.code === code && (!country || c.country === country));
        if (found) return found;
    }
    return CURRENCIES[0];
};

export const saveCurrency = (currency: CurrencyConfig): void => {
    if (typeof window === "undefined") return;
    // Save as "code:country" to uniquely identify (e.g., "EUR:Germany" vs "EUR:France")
    localStorage.setItem(CURRENCY_STORAGE_KEY, `${currency.code}:${currency.country}`);
};

export const formatAmount = (amount: number, currency: CurrencyConfig): string => {
    return `${currency.symbol}${amount.toLocaleString(currency.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
