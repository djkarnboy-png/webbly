"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  AUTH_ACTION_PARAM,
  loginPathFor,
  verificationPathFor,
  withAuthAction,
  withoutAuthAction,
} from "@/lib/auth-redirect";
import { RequestForm } from "./RequestForm";

type RequestType = "similar" | "contact" | "general";

export type RequestModalContextValue = {
  templateName?: string;
  creatorName?: string;
  templateId?: string;
  creatorId?: string;
  requestType: RequestType;
};

type RequestModalApi = {
  openRequestModal: (value?: Partial<RequestModalContextValue>) => void;
  closeRequestModal: () => void;
};

const RequestModalContext = createContext<RequestModalApi | null>(null);

export function RequestModalProvider({
  authenticated,
  verified,
  children,
}: {
  authenticated: boolean;
  verified: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<RequestModalContextValue>({
    requestType: "general",
  });

  const closeRequestModal = useCallback(() => setIsOpen(false), []);
  const openRequestModal = useCallback(
    (value: Partial<RequestModalContextValue> = {}) => {
      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const next = withAuthAction(currentPath, "request", {
        requestType: value.requestType ?? "general",
        templateName: value.templateName,
        creatorName: value.creatorName,
        templateId: value.templateId,
        creatorId: value.creatorId,
      });

      if (!authenticated) {
        router.push(loginPathFor(next));
        return;
      }

      if (!verified) {
        router.push(verificationPathFor(next));
        return;
      }

      setContext({
        requestType: value.requestType ?? "general",
        templateName: value.templateName,
        creatorName: value.creatorName,
        templateId: value.templateId,
        creatorId: value.creatorId,
      });
      setIsOpen(true);
    },
    [authenticated, router, verified],
  );

  useEffect(() => {
    if (!verified) {
      return;
    }

    const url = new URL(window.location.href);
    if (url.searchParams.get(AUTH_ACTION_PARAM) !== "request") {
      return;
    }

    const requestType = url.searchParams.get("requestType");
    const currentPath = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(
      window.history.state,
      "",
      withoutAuthAction(currentPath),
    );
    const timer = window.setTimeout(() => {
      openRequestModal({
        requestType:
          requestType === "contact" || requestType === "similar"
            ? requestType
            : "general",
        templateName: url.searchParams.get("templateName") ?? undefined,
        creatorName: url.searchParams.get("creatorName") ?? undefined,
        templateId: url.searchParams.get("templateId") ?? undefined,
        creatorId: url.searchParams.get("creatorId") ?? undefined,
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [openRequestModal, verified]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeRequestModal();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeRequestModal, isOpen]);

  const api = useMemo(
    () => ({ openRequestModal, closeRequestModal }),
    [closeRequestModal, openRequestModal],
  );

  const title =
    context.requestType === "contact"
      ? "Contact this creator"
      : context.requestType === "similar"
        ? "Request a similar website"
        : "Request a website";

  return (
    <RequestModalContext.Provider value={api}>
      {children}
      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-modal-title"
          aria-describedby="request-modal-description"
        >
          <button
            className="absolute inset-0 cursor-default"
            type="button"
            aria-label="Close request form"
            onClick={closeRequestModal}
          />
          <div className="app-panel relative max-h-[96vh] w-full max-w-4xl overflow-y-auto rounded-t-lg shadow-[0_30px_100px_rgba(0,0,0,0.7)] sm:max-h-[92vh] sm:rounded-lg">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#0b1018]/95 px-5 py-5 backdrop-blur sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase text-blue-400">Webbly request</p>
                <h2 id="request-modal-title" className="mt-1 text-2xl font-bold text-slate-50">
                  {title}
                </h2>
                <p id="request-modal-description" className="mt-1 text-sm text-slate-500">
                  {context.templateName
                    ? `${context.templateName}${context.creatorName ? ` by ${context.creatorName}` : ""}`
                    : "Share enough context for a creator to understand the website you want."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeRequestModal}
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
                aria-label="Close request form"
              >
                <span className="absolute h-0.5 w-4 rotate-45 bg-current" />
                <span className="absolute h-0.5 w-4 -rotate-45 bg-current" />
              </button>
            </div>
            <div className="p-5 sm:p-7">
              <RequestForm context={context} embedded />
            </div>
          </div>
        </div>
      ) : null}
    </RequestModalContext.Provider>
  );
}

export function useRequestModal() {
  const context = useContext(RequestModalContext);

  if (!context) {
    throw new Error("useRequestModal must be used inside RequestModalProvider");
  }

  return context;
}
