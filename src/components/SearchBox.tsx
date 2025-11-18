"use client";
import React from "react";

export default function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void; }) {
  return (
    <input
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: 6, borderRadius: 6, border: "1px solid #ccc" }}
    />
  );
}
