import type { Appearance } from "@clerk/types";

export const clerkAppearance: Appearance = {
  variables: {
    colorBackground: "#1a2332",
    colorText: "#f8fafc",
    colorTextSecondary: "#94a3b8",
    colorInputBackground: "rgba(255, 255, 255, 0.08)",
    colorInputText: "#f8fafc",
    colorPrimary: "#e8841a",
    colorDanger: "#ef4444",
    colorSuccess: "#22c55e",
    colorNeutral: "#94a3b8",
    borderRadius: "0.75rem",
    fontFamily: "inherit",
  },
  elements: {
    rootBox: "mx-auto w-full max-w-md",
    cardBox: "shadow-none",
    card: [
      "bg-[#1a2332]/95 backdrop-blur-xl",
      "border border-white/15",
      "shadow-2xl shadow-black/40",
      "rounded-2xl",
    ].join(" "),
    headerTitle: "text-foreground text-xl font-bold",
    headerSubtitle: "text-muted text-sm",
    socialButtonsBlockButton:
      "border border-white/15 bg-white/5 text-foreground hover:bg-white/10",
    socialButtonsBlockButtonText: "text-foreground font-medium",
    dividerLine: "bg-white/10",
    dividerText: "text-muted",
    formFieldLabel: "text-foreground text-sm font-medium",
    formFieldInput:
      "bg-white/5 border-white/15 text-foreground placeholder:text-muted focus:border-primary/50 focus:ring-primary/30",
    formButtonPrimary:
      "bg-primary hover:bg-[#d97706] text-white font-semibold shadow-md",
    footerActionText: "text-muted",
    footerActionLink: "text-primary hover:text-[#d97706] font-semibold",
    identityPreviewText: "text-foreground",
    identityPreviewEditButton: "text-primary",
    formFieldInputShowPasswordButton: "text-muted hover:text-foreground",
    alertText: "text-foreground",
    formFieldErrorText: "text-danger",
    otpCodeFieldInput: "bg-white/5 border-white/15 text-foreground",
    navbar: "hidden",
    logoBox: "hidden",
  },
};
