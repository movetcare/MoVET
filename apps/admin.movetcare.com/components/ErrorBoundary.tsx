import React from "react";
import Error from "./Error";
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error({ error, errorInfo });
  }
  render() {
    if ((this.state as any).hasError) {
      return (
        <Error error={{ code: 500, message: "Something Went Wrong..." }} />
      );
    }
    return (this.props as any).children;
  }
}

export default ErrorBoundary;
