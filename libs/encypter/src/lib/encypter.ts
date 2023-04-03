import { AES as Encrypter, enc } from 'crypto-js';

const CRYPTJS_SECRET = 'crypting_secret_for_network_lines';

export type ColumnType = string | number | boolean | Date | null;
export type CustomRecord = Record<string, ColumnType>;

/**
 *
 * @param data Data to encrypt
 * @returns encrypted string
 */
export function encrypt(data: ColumnType | object) {
  return Encrypter.encrypt(JSON.stringify(data), CRYPTJS_SECRET).toString();
}

/**
 * @type T decrypted value wanted Type
 * @param encryptedString
 * @returns a decrypted value (typeof value = primitif type) or a decrypted object
 */
export function decrypt<T>(encryptedString: string) {
  return JSON.parse(
    Encrypter.decrypt(encryptedString, CRYPTJS_SECRET).toString(enc.Utf8)
  ) as T;
}
