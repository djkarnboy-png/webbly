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
import { RequestForm } from "./RequestForm";

type RequestType = "similar" | "contact" | "general";

export type RequestModalContextValue = {
  templateName?: string;
  creatorName?: string;
  requestType: RequestType;
};

type RequestModalApi = {
  openRequestModal: (value?: Partial<RequestModalContextValue>) => void;
  closeRequestModal: () => void;
};

const RequestModalContext = createContext<RequestModalApi | null>(null);

export function RequestModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<RequestModalContextValue>({
    requestType: "general",
  });

  const closeRequestModal = useCallback(() => setIsOpen(false), []);
  const openRequestModal = useCallback(
    (value: Partial<RequestModalContextValue> = {}) => {
      setContext({
        requestType: value.requestType ?? "general",
        templateName: value.templateName,
        creatorName: value.creatorName,
      });
      setIsOpen(true);
    },
    [],
  );

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
      : "Request a similar website";

  return (
    <RequestModalContext.Provider value={api}>
      {children}
      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-5"
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
          <div className="relative max-h-[96vh] w-full max-w-4xl overflow-y-auto rounded-t-lg bg-white shadow-[0_30px_90px_rgba(15,23,42,0.35)] sm:max-h-[92vh] sm:rounded-lg">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-5 backdrop-blur sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase text-blue-700">Webbly request</p>
                <h2 id="request-modal-title" className="mt-1 text-2xl font-bold text-slate-950">
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
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
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
