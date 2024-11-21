
import { BrowserInfoDto } from '../models/payIn';

// browser-info.util.ts
export function getBrowserInfo(): BrowserInfoDto {
  return {
    AcceptHeader: navigator.userAgent,
    UserAgent: navigator.userAgent,
    ScreenHeight: window.screen.height,
    ScreenWidth: window.screen.width,
    TimeZoneOffset: new Date().getTimezoneOffset().toString(),
    ColorDepth: window.screen.colorDepth,
    Language: navigator.language || (navigator as any).userLanguage,
    JavaEnabled: navigator.javaEnabled(),
    JavascriptEnabled: true,
  };
}

