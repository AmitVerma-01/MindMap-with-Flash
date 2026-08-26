"use client";

import { Lottie } from "lottie-react";
import loadingAnimation from "@/lib/lottie/loading.json";
import generatingAnimation from "@/lib/lottie/generating.json";
import PageBackground from "@/components/layout/PageBackground";

type Variant = "default" | "generating";

interface LoadingLottieProps {
  size?: number;
  variant?: Variant;
  className?: string;
  label?: string;
}

export function LoadingLottie({
  size = 120,
  variant = "default",
  className = "",
  label = "Loading",
}: LoadingLottieProps) {
  const animationData =
    variant === "generating" ? generatingAnimation : loadingAnimation;

  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <Lottie
        src={animationData}
        loop
        autoplay
        style={{ width: size, height: size }}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

interface LoadingScreenProps {
  message?: string;
  variant?: Variant;
  size?: number;
}

export function LoadingScreen({
  message,
  variant = "default",
  size = 180,
}: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-6 px-4">
      <LoadingLottie size={size} variant={variant} label={message ?? "Loading"} />
      {message && (
        <p className="text-primary text-base font-medium tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

interface PageLoadingProps {
  message?: string;
  variant?: Variant;
  /** Fixed overlay on top of current page content */
  overlay?: boolean;
}

export function PageLoading({
  message = "Loading...",
  variant = "default",
  overlay = false,
}: PageLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={
        overlay
          ? "fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          : "relative min-h-screen flex items-center justify-center overflow-hidden"
      }
    >
      <PageBackground />
      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
        <LoadingLottie size={220} variant={variant} label={message} />
        <p className="text-primary text-lg font-semibold tracking-wide animate-pulse max-w-sm">
          {message}
        </p>
      </div>
    </div>
  );
}
