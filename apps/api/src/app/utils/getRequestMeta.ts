import { Request } from "express";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

export interface RequestMeta {
  ipAddress: string | null;
  country: string | null;
  city: string | null;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
}

const extractIp = (req: Request): string | null => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip ?? null;
};

export const getRequestMeta = (req: Request): RequestMeta => {
  const ipAddress = extractIp(req);

  // geoip-lite returns null for localhost/private IPs (normal in dev).
  const geo = ipAddress ? geoip.lookup(ipAddress) : null;

  const userAgent = req.headers["user-agent"] ?? "";
  const { device, browser, os } = UAParser(userAgent);

  return {
    ipAddress,
    country: geo?.country ?? null,
    city: geo?.city ?? null,
    deviceType: device.type ?? "desktop",
    browser: browser.name ?? null,
    os: os.name ?? null,
  };
};
