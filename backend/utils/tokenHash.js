import crypto from 'crypto';

export function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex")
}

export function safeCompare(a, b) {
    try {
        const bufA = Buffer.from(a, "hex");
        const bufB = Buffer.from(b, "hex");

        if (bufA.length !== bufB.length) return false;

        return crypto.timingSafeEqual(bufA,bufB)
    } catch (error) {
        return false;
    }
}