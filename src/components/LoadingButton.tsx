// src/components/LoadingButton.tsx
"use client";

import React from "react";
import LoadingSpinner from "./LoadingSpinner";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  spinnerSize?: number;
};

export default function LoadingButton({
  loading = false,
  spinnerSize = 16,
  children,
  disabled,
  className = "",
  ...rest
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...rest}
      disabled={isDisabled}
      aria-busy={loading}
      className={
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded focus:outline-none " +
        className
      }
    >
      {loading && <LoadingSpinner size={spinnerSize} />}
      <span>{children}</span>
    </button>
  );
}
