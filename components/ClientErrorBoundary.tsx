"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  label?: string;
};

type State = { hasError: boolean; error?: any };

export default class ClientErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // Avoid user PII. Log minimal info to console; integrate with real logger if available
    console.error("ClientErrorBoundary:", this.props.label || "section", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 my-4 border border-red-200 bg-red-50 rounded text-red-800 text-sm">
            Something went wrong loading this section.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
