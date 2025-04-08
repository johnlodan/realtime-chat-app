const sanitizeHtml = require("sanitize-html");

// Fields that should NOT be sanitized (e.g., authentication tokens)
const excludeFields = ["session_token", "refresh_token", "cookie"];

const detectXSS = (input: any) => {
  if (typeof input !== "string") return false;

  // Common XSS attack patterns
  const xssPatterns = [
    /<script.*?>.*?<\/script>/gi,  // Script tags
    /on\w+\s*=/gi,                 // Inline event handlers (onmouseover, onclick, etc.)
    /javascript:/gi,               // JavaScript execution via href/src
    /<iframe.*?>.*?<\/iframe>/gi,   // Iframe injections
    /data:image\/svg\+xml/gi,      // SVG-based XSS attacks
    /&#x?[0-9a-fA-F]+;/gi,         // Hexadecimal/HTML entity encoding
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
};

const sanitizeObject = (obj: any, parentKey = "") => {
  if (!obj || typeof obj !== "object") return obj;

  for (let key in obj) {
    try {
      if (excludeFields.includes(key)) continue; // Skip sanitization for authentication tokens

      if (typeof obj[key] === "string") {
        if (detectXSS(obj[key])) {
          return {
            error: `Potential XSS detected in field: ${parentKey || key}`,
            value: obj[key]
          };
        }
        obj[key] = sanitizeHtml(obj[key], { allowedTags: [], allowedAttributes: {} }); // Remove all HTML tags
      } else if (typeof obj[key] === "object") {
        const result: any = sanitizeObject(obj[key], key); // Recursively sanitize nested objects
        if (result?.error) return result;
      }
    } catch (error) {
      console.error(`Sanitization failed for key: ${parentKey || key}`, error);
      return { error: `Error processing field: ${parentKey || key}` };
    }
  }
};

const sanitizedInputsMiddleware = (req: any, res: any, next: any) => {
  try {
    // Sanitize request body, query, and headers separately
    const bodyResult = sanitizeObject(req.body);
    const queryResult = sanitizeObject(req.query);
    const headersResult = sanitizeObject(req.headers);

    // If sanitization detects an issue, return an error response
    if (bodyResult?.error) {
      return res.status(400).json({
        success: false,
        message: `${bodyResult.error}, ${bodyResult.value}`,
      });
    }

    if (queryResult?.error) {
      return res.status(400).json({
        success: false,
        message: `${queryResult.error}, ${queryResult.value}`,
      });
    }

    if (headersResult?.error) {
      return res.status(400).json({
        success: false,
        message: `${headersResult.error}, ${headersResult.value}`,
      });
    }
  } catch (error) {
    console.error("Unexpected error in sanitization:", error);
  }

  next(); // Continue to the next middleware if everything is clean
};

module.exports = sanitizedInputsMiddleware;