import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY = crypto.createHash('sha256').update('secret-key-123').digest()

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16); 
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decrypt = (encryptedText: string): string => {
    const [iv, encrypted] = encryptedText.split(':');
  
    if (!iv || !encrypted) {
      throw new Error('Invalid encrypted text format');
    }
  
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      KEY,
      Buffer.from(iv, 'hex')
    );
  
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, 'hex')),
      decipher.final(),
    ]);
  
    return decrypted.toString('utf8');
  };
  