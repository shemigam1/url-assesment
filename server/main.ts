import express, { Request, Response } from "express";
import cors from "cors";
import {
  isValidUrl,
  buildShortUrl,
  reverseMapping,
  //   generateShortCode,
  generateUniqueCode,
  urlStorage,
} from "./utils";

const app = express();
export const PORT = process.env.PORT || 8080;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/shorten", (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    // Validate request body
    if (!url) {
      res.status(400).json({ error: "URL is required" });
      return;
    }

    // Validate URL format
    if (!isValidUrl(url)) {
      res.status(400).json({
        error: "URL must be valid and start with http:// or https://",
      });
      return;
    }

    // Check if URL already exists (deduplication)
    const existingCode = reverseMapping.get(url);
    if (existingCode) {
      res.status(200).json({ shortUrl: buildShortUrl(existingCode) });
      return;
    }

    // Generate unique code
    const code = generateUniqueCode();

    // Store in memory
    urlStorage[code] = {
      url,
      createdAt: Date.now(),
      visits: 0,
    };

    // Add to reverse mapping for deduplication
    reverseMapping.set(url, code);

    res.status(201).json({ shortUrl: buildShortUrl(code) });
  } catch (error) {
    res.status(500).json({ error: "Failed to shorten URL" });
  }
});

app.get("/:code", (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    // Validate code format (basic check)
    if (!code || typeof code !== "string" || code.length === 0) {
      res.status(400).json({ error: "Invalid code format" });
      return;
    }

    // Look up the URL
    const entry = urlStorage[code];

    if (!entry) {
      res.status(404).json({ error: "URL not found" });
      return;
    }

    // Increment visit counter
    entry.visits++;

    // Check if this is a stats request (via query parameter)
    // If accessing from browser, redirect; if from API, return stats
    const isApiRequest =
      req.query.stats === "true" ||
      req.headers.accept?.includes("application/json");

    if (isApiRequest) {
      res.status(200).json({
        url: entry.url,
        createdAt: entry.createdAt,
        visits: entry.visits,
      });
    } else {
      // Redirect to original URL
      res.redirect(302, entry.url);
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Error in GET /:code:", errorMsg);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/stats/:code", (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    if (!code || typeof code !== "string" || code.length === 0) {
      res.status(400).json({ error: "Invalid code format" });
      return;
    }

    const entry = urlStorage[code];

    if (!entry) {
      res.status(404).json({ error: "URL not found" });
      return;
    }

    res.status(200).json({
      url: entry.url,
      createdAt: entry.createdAt,
      visits: entry.visits,
    });
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Error in GET /api/stats/:code:", errorMsg);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/health", (_: Request, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// app.use("**", (_: Request, res: Response) => {
//   return res.status(404).send("NOT FOUND");
// });

app.listen(PORT, async () => {
  console.log(`Listening on ${PORT}`);
});
