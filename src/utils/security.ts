import * as crypto from 'crypto-ts';
import { CryptoType } from '../types/cryptoType';

export function decrypt(key: string, iv: string, text: string) {
    // Decodifica el IV y el texto encriptado desde Base64
    const ivBytes = crypto.enc.Base64.parse(iv);
    const encryptedBytes = crypto.enc.Base64.parse(text);

    // Desencripta usando AES y el IV
    const decrypted = crypto.AES.decrypt(
        { ciphertext: encryptedBytes },
        key,
        { iv: ivBytes, mode: crypto.mode.CBC, padding: crypto.pad.PKCS7 }
    );

    return JSON.parse(decrypted.toString(crypto.enc.Utf8));
}
export function decryptDB( key: string, text: string): string {
	return crypto.AES.decrypt(text.toString(), key).toString(crypto.enc.Utf8)
}