"use client";

import {
  createContext,
  useCallback,
  useContext,
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

  const api = useMemo(
    () => ({ openRequestModal, closeRequestModal }),
    [closeRequestModal, openRequestModal],
  );

  return (
    <RequestModalContext.Provider value={api}>
      {children}
      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="request-modal-title"
        >
          <button
            className="absolute inset-0 cursor-default"
            type="button"
            aria-label="Close request form"
            onClick={closeRequestModal}
          />
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/80 bg-white shadow-2xl shadow-slate-950/25">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Webbly request
                </p>
                <h2
                  id="request-modal-title"
                  className="mt-1 text-xl font-black text-slate-950 sm:text-2xl"
                >
                  {context.requestType === "contact"
                    ? "Contact this creator"
                    : "Request a similar website"}
                </h2>
                {context.templateName ? (
                  <p className="mt-1 text-sm text-slate-500">
                    About {context.templateName}
                    {context.creatorName ? ` by ${context.creatorName}` : ""}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-slate-500">
                    Share what you want built and which website direction fits.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeRequestModal}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xl leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                aria-label="Close request form"
              >
                x
              </button>
            </div>
            <div className="p-5 sm:p-6">
              <RequestForm
                context={context}
                onSubmitted={() => {
                  window.setTimeout(closeRequestModal, 2200);
                }}
              />
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
