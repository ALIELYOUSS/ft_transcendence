"use client";

import { useEffect } from "react";

export default function GoogleCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (!accessToken || !refreshToken) {
      window.location.replace("/auth/login");
      return;
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    window.location.replace("/auth/login");
  }, []);

  return <main className="flex min-h-screen items-center justify-center">Signing you in...</main>;
}
