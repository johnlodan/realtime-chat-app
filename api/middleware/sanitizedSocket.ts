import sanitizeHtml from "sanitize-html";
import { Socket } from "socket.io";

const excludeFields = ["session_token", "refresh_token", "cookie"];

const detectXSS = (input: any): boolean => {
    if (typeof input !== "string") return false;

    const xssPatterns = [
        /<script.*?>.*?<\/script>/gi,
        /on\w+\s*=/gi,
        /javascript:/gi,
        /<iframe.*?>.*?<\/iframe>/gi,
        /data:image\/svg\+xml/gi,
        /&#x?[0-9a-fA-F]+;/gi,
    ];

    return xssPatterns.some((pattern) => pattern.test(input));
};

interface SanitizeResult {
    error?: string;
    value?: any;
}

const sanitizeObject = (obj: any, parentKey = ""): SanitizeResult | void => {
    if (!obj || typeof obj !== "object") return;

    for (let key in obj) {
        try {
            if (excludeFields.includes(key)) continue;

            if (typeof obj[key] === "string") {
                if (detectXSS(obj[key])) {
                    return {
                        error: `Potential XSS detected in field: ${parentKey || key}`,
                        value: obj[key],
                    };
                }
                obj[key] = sanitizeHtml(obj[key], {
                    allowedTags: [],
                    allowedAttributes: {},
                });
            } else if (typeof obj[key] === "object") {
                const result = sanitizeObject(obj[key], key);
                if (result?.error) return result;
            }
        } catch (error) {
            console.error(`Sanitization failed for key: ${parentKey || key}`, error);
            return { error: `Error processing field: ${parentKey || key}` };
        }
    }
};

const socketSanitizerMiddleware = (socket: Socket, next: (err?: Error) => void): void => {
    const { headers, auth, query } = socket.handshake;

    const results = [sanitizeObject(headers), sanitizeObject(auth), sanitizeObject(query)];

    const error = results.find((r) => r?.error);
    if (error) {
        return next(new Error(`XSS in socket handshake: ${error.error}`));
    }

    next();
};

const withSanitization = <T = any>(
    handler: (data: T, callback?: Function) => void
) => {
    return (data: T, callback?: Function) => {
        const result = sanitizeObject(data);
        if (result?.error) {
            if (callback) return callback({ success: false, message: result.error });
            return;
        }
        handler(data, callback);
    };
};

export {
    socketSanitizerMiddleware,
    withSanitization,
};
