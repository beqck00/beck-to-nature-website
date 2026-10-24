"use client";

import { useRef, useState } from "react";

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// Copies text and briefly swaps the label to confirm.
export function useCopyLabel(label: string) {
  const [text, setText] = useState(label);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const run = async (value: string) => {
    const ok = await copyText(value);
    setText(ok ? "Copied" : "Select and copy");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setText(label), 1600);
  };
  return [text, run] as const;
}

export default function CopyButton({ targetId }: { targetId: string }) {
  const [label, copy] = useCopyLabel("Copy");
  return (
    <button
      className="copy"
      type="button"
      onClick={() => {
        const el = document.getElementById(targetId);
        if (!el) return;
        copy(el.textContent?.trim() ?? "");
        try {
          const range = document.createRange();
          range.selectNodeContents(el);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        } catch {}
      }}
    >
      {label}
    </button>
  );
}
