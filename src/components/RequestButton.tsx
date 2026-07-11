"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "./Button";
import { useRequestModal, type RequestModalContextValue } from "./RequestModalProvider";

type RequestButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "inverse"
    | "inverseOutline";
  size?: "sm" | "md" | "lg";
  templateName?: string;
  creatorName?: string;
  requestType?: RequestModalContextValue["requestType"];
};

export function RequestButton({
  children,
  templateName,
  creatorName,
  requestType = "general",
  onClick,
  ...props
}: RequestButtonProps) {
  const { openRequestModal } = useRequestModal();

  return (
    <Button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          openRequestModal({ templateName, creatorName, requestType });
        }
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
