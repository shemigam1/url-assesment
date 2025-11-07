import React, { useState } from "react";
import { Copy, Check, AlertCircle, Loader } from "lucide-react";

interface ShortenedUrlData {
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  visits: number;
}

interface ApiErrorResponse {
  error: string;
}

export default function UrlShortener(): React.ReactElement {
  const [inputUrl, setInputUrl] = useState<string>("");
  const [shortenedData, setShortenedData] = useState<ShortenedUrlData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const API_BASE_URL = "http://localhost:8080";

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return false;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("URL must start with http:// or https://");
      return false;
    }

    try {
      new URL(url);
      return true;
    } catch {
      setError("Please enter a valid URL");
      return false;
    }
  };

  const handleShorten = async (): Promise<void> => {
    setError("");
    setCopied(false);

    if (!validateUrl(inputUrl)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: inputUrl }),
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(errorData.error || "Failed to shorten URL");
      }

      const data: ShortenedUrlData = await response.json();
      setShortenedData(data);
      setInputUrl("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async (): Promise<void> => {
    if (!shortenedData) return;

    try {
      await navigator.clipboard.writeText(shortenedData.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy URL");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !loading) {
      handleShorten();
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            URL Shortener
          </h1>
          <p className="text-gray-600">
            Create short, shareable links instantly
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Input Section */}
          <div className="mb-6">
            <label
              htmlFor="urlInput"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter your URL
            </label>
            <div className="flex gap-2">
              <input
                id="urlInput"
                type="url"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                placeholder="https://example.com/very/long/url"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                disabled={loading}
              />
              <button
                onClick={handleShorten}
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Shortening...
                  </>
                ) : (
                  "Shorten"
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Results Section */}
          {shortenedData && (
            <div className="space-y-6">
              {/* Short URL Card */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  Your shortened URL
                </h2>
                <div className="flex items-center gap-3">
                  <div className="flex-1 break-all">
                    <a
                      href={shortenedData.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-mono text-indigo-600 hover:text-indigo-800 underline"
                    >
                      {shortenedData.shortUrl}
                    </a>
                  </div>
                  <button
                    onClick={handleCopyUrl}
                    className="flex-shrink-0 p-2 hover:bg-indigo-100 rounded-lg transition"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-indigo-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                    Visits
                  </p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {shortenedData.visits}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                    Created
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {formatDate(shortenedData.createdAt)}
                  </p>
                </div>
              </div>

              {/* Original URL */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                  Original URL
                </p>
                <a
                  href={shortenedData.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-indigo-600 break-all underline"
                >
                  {shortenedData.originalUrl}
                </a>
              </div>

              {/* New Link Button */}
              <button
                onClick={() => {
                  setShortenedData(null);
                  setInputUrl("");
                  setError("");
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Shorten Another URL
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-600 text-sm">
          <p>Your URLs are stored securely and can be shared instantly</p>
        </div>
      </div>
    </div>
  );
}
