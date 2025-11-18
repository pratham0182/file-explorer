// app/providers.tsx
"use client";
import { FileSystemProvider } from "../context/FileSystemContext";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <FileSystemProvider>{children}</FileSystemProvider>;
}
