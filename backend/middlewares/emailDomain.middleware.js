import dns from 'dns/promises';
import fs from 'fs';
import path from 'path'

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';


const filePath = path.join(process.cwd(), "utils/disposableDomains.json");
const domains=JSON.parse(fs.readFileSync(filePath,"utf-8"))
const disposableSet = new Set(domains);

// Check if domain has mx Record

async function hasValidMx(domain) {
    try {
        const records = await dns.resolveMx(domain);
        return Array.isArray(records) && records.length > 0;
    } catch (error) {
        return false;
    }
}


// Middleware

export const validateEmailDomain = asyncHandler(async (req, res, next) => {
    const rawEmail = req.body?.email;

    if (!rawEmail || typeof rawEmail !== "string") {
        throw new ApiError(400, "Email is required");
    }

    const email = rawEmail.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new ApiError(400,"Enter a valid email")
    }

    const [, domain] = email.split("@");

    if (!domain) {
        throw new ApiError(400, "Invalid email domain");
    }

    if (disposableSet.has(domain)) {
        throw new ApiError(400, "Disposable email addresses are not allowed");
    }

    const mxOk = await hasValidMx(domain);

    if (!mxOk) {
        throw new ApiError(400,"Email domain cannot receive messages")
    }


    next();
})