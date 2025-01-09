import { ReactNode, forwardRef } from "react";

interface HiddenPDFContainerProps {
  children: ReactNode;
}

export const HiddenPDFContainer = forwardRef<
  HTMLDivElement,
  HiddenPDFContainerProps
>(({ children }, ref) => {
  return (
    <div
      ref={ref}
      style={{ display: "none", position: "absolute", zIndex: -1 }}
    >
      {children}
    </div>
  );
});

HiddenPDFContainer.displayName = "HiddenPDFContainer"; // Necesario para forwardRef
