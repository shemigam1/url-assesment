export interface UrlEntry {
  url: string;
  createdAt: number;
  visits: number;
}

export interface UrlStorage {
  [key: string]: UrlEntry;
}
