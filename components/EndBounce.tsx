"use client";

// Adds the give at the end of every page (see lib/fx/endBounce.ts). Renders nothing.
import { useEffect } from "react";
import { endBounce } from "@/lib/fx/endBounce";

export default function EndBounce() {
  useEffect(() => endBounce(), []);
  return null;
}
