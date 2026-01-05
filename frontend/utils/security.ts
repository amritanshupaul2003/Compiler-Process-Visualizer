// utils/security.ts
class CodeProtector {
  private static secret = process.env.NEXT_PUBLIC_APP_SECRET || "this is build by @amritanshu_paul go an check his github repo";
  private static encryptionKey = process.env.ENCRYPTION_KEY || "123456789";

  static encryptCode(code: string): string {
    // Simple XOR encryption for demonstration
    let encrypted = '';
    for (let i = 0; i < code.length; i++) {
      const keyChar = this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
      encrypted += String.fromCharCode(code.charCodeAt(i) ^ keyChar);
    }
    return btoa(encrypted);
  }

  static decryptCode(encrypted: string): string {
    try {
      const decoded = atob(encrypted);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        const keyChar = this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
        decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ keyChar);
      }
      return decrypted;
    } catch {
      return '';
    }
  }

  static generateSignature(data: string): string {
    // Generate a hash signature
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return (hash >>> 0).toString(36) + this.secret.slice(0, 5);
  }
}

export default CodeProtector;