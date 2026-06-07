import { Component, type ErrorInfo, type ReactNode } from "react";
import ServerError from "@/components/common/server-error/ServerError";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // ส่ง error ไปยัง monitoring service ได้ที่นี่ (Sentry, Datadog ฯลฯ)
    console.error("[ErrorBoundary] Uncaught error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <ServerError />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;