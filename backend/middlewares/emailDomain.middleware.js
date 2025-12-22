import dns from 'dns/promises';


import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import logger from '../utils/logger.js';



let disposableSet = new Set();
let refreshInterval = null;
async function loadDisposableDomains() {
    try {
        const res = await fetch('https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt')
        
        if (!res.ok) {
            throw new Error("Failed to fetch disposable domains");
    
        }
        const text = await res.text();
        const domains = text.split('\n').map(d => d.trim().toLowerCase()).filter(d => d.length > 0)
        disposableSet = new Set(domains);
        
        
        
        
    } catch (error) {
        logger.error("Failed to load disposable domains list",error)
    }
}

loadDisposableDomains();

if (!refreshInterval) {
    refreshInterval=setInterval(loadDisposableDomains, 24 * 60 * 60 * 1000);
}

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