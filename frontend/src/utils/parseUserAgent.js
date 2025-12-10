export default function parseUserAgent(ua = "") {
    if (!ua) return { browser: "Unknown", os: "Unknown", device: "Unknown" };

    const lower = ua.toLowerCase();

    let os = "Unknown OS";

    if (lower.includes("windows")) os = "Windows";
    else if (lower.includes("mac os")) os = "macos";
    else if (lower.includes("iphone")) os = "iPhone";
    else if (lower.includes("ipad")) os = "iPad";
    else if (lower.includes("android")) os = "Android";
    else if (lower.includes("linux")) os = "Linux";


    let browser = "Unknown Browser";
    if (lower.includes("edg")) browser = "Edge";
    else if (lower.includes("chrome") && !lower.includes("edg")) browser = "Chrome";
    else if (lower.includes("safari") && !lower.includes("chrome")) browser = "Safari";
    else if (lower.includes("firefox")) browser = "Firefox";
    else if (lower.includes("brave")) browser = "Brave";

    let device = "Desktop";
    if (lower.includes("iphone") || lower.includes("android") && lower.includes("mobile")) device = "Phone";
    else if (lower.includes("ipad") || lower.includes("android") && lower.includes("mobile")) device = "Tablet";

    return {browser,os,device}
}