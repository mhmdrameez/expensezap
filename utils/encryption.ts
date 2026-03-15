import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-secret-key-for-development-only';

/**
 * Encrypts a string using AES
 */
export const encryptData = (data: string): string => {
    try {
        return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    } catch (error) {
        console.error('Encryption failed:', error);
        return data; // Fallback to raw data if encryption fails
    }
};

/**
 * Decrypts an AES encrypted string
 */
export const decryptData = (ciphertext: string): string => {
    try {
        if (!ciphertext) return '';
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        // If decryption results in empty string, it might not be encrypted or key is wrong
        if (!originalText && ciphertext) {
            return ciphertext;
        }

        return originalText;
    } catch (error) {
        console.error('Decryption failed:', error);
        return ciphertext; // Return ciphertext if it looks like it wasn't encrypted
    }
};

/**
 * Helper to check if data is likely encrypted (AES ciphertext usually starts with 'U2FsdGVkX1')
 * but we'll try to decrypt anyway in decryptData for robustness.
 */
export const isEncrypted = (data: string): boolean => {
    return typeof data === 'string' && data.startsWith('U2FsdGVkX1');
};
