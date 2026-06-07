import axios from "axios";
import type { HttpErrorCode } from "@/context/ErrorContext";

// Singleton setter — ถูก inject จาก AppRoutes ตอน mount
let _setError: ((code: HttpErrorCode) => void) | null = null;

export const registerErrorHandler = (fn: (code: HttpErrorCode) => void) => {
  _setError = fn;
};

// ─── Axios instance ───────────────────────────────────────────────
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// ─── Response interceptor ─────────────────────────────────────────
httpClient.interceptors.response.use(
  (response) => response, // 2xx — pass through

  (error) => {
    const status = error?.response?.status as number | undefined;

    const SERVER_ERROR_CODES: Record<number, HttpErrorCode> = {
      500: 500,
      503: 503,
      504: 504,
    };

    if (status && status in SERVER_ERROR_CODES) {
      _setError?.(SERVER_ERROR_CODES[status]);
    }

    // ดัก network timeout (ไม่มี response) → แสดงเป็น 504
    if (!error.response && error.code === "ECONNABORTED") {
      _setError?.(504);
    }

    return Promise.reject(error);
  }
);

export default httpClient;