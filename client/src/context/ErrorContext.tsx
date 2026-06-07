import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type HttpErrorCode = 500 | 503 | 504 | null;

export interface ErrorContextValue {
  errorCode: HttpErrorCode;
  setError: (code: HttpErrorCode) => void;
  clearError: () => void;
}

interface ErrorProviderProps {
  children: ReactNode;
  initialError?: HttpErrorCode;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export function ErrorProvider({ children, initialError = null }: ErrorProviderProps): JSX.Element {
  const [errorCode, setErrorCode] = useState<HttpErrorCode>(initialError);

  const setError = useCallback((code: HttpErrorCode) => {
    setErrorCode(code);
  }, []);

  const clearError = useCallback(() => {
    setErrorCode(null);
  }, []);

  const value = useMemo(() => ({ errorCode, setError, clearError }), [errorCode, setError, clearError]);

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError(): ErrorContextValue {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}