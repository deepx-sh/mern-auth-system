import dns from 'dns/promises';


import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';



let disposableSet = new Set();

async function loadDisposableDomains() {
    try {
        const res = await fetch('https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt')
        
        if (!res.ok) {
            throw new Error("Failed to fetch disposable domains");
    
        }
        const text = await res.text();
        const domains = text.split('\n').map(d => d.trim().toLowerCase()).filter(d => d.length > 0)
        disposableSet = new Set(domains);
        
        
        console.log(`Loaded ${disposableSet.size} disposable domains`);
        
    } catch (error) {
        console.error("Failed to load disposable domains list",error.message)
    }
}

loadDisposableDomains();

setInterval(loadDisposableDomains, 24 * 60 * 60 * 1000);

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
    console.log(rawEmail);
    
    if (!rawEmail || typeof rawEmail !== "string") {
        throw new ApiError(400, "Email is required");
    }

    const email = rawEmail.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new ApiError(400,"Enter a valid email")
    }

    const [, domain] = email.split("@");
    console.log(domain);
    
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