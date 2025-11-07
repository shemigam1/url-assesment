import { UrlStorage } from "./types";

// import { PORT } from "./main";
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:8080";
export const CODE_LENGTH = 6;
export const CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const urlStorage: UrlStorage = {};
export const reverseMapping: Map<string, string> = new Map();

export const buildShortUrl = (code: string): string => {
  return `${CLIENT_URL}/${code}`;
};

export const isValidUrl = (urlString: string): boolean => {
  if (!urlString || typeof urlString !== "string") {
    return false;
  }

  if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
    return false;
  }

  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
};

export const generateUniqueCode = (): string => {
  let code = generateShortCode();
  let attempts = 0;
  const maxAttempts = 100;

  while (urlStorage[code] && attempts < maxAttempts) {
    code = generateShortCode();
    attempts++;
  }

  if (attempts === maxAttempts) {
    throw new Error("Failed to generate unique code after multiple attempts");
  }

  return code;
};

export const generateShortCode = (length: number = CODE_LENGTH): string => {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
  }
  return code;
};
