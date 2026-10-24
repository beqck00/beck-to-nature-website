"use client";

import { useEffect, useRef, useState } from "react";

const PhotoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5" />
  </svg>
);

// Local preview only: the chosen file never leaves the browser.
export default function PhotoSlot({
  title,
  hint,
  className = "",
  icon = true,
  allowVideo = true,
}: {
  title: string;
  hint: string;
  className?: string;
  icon?: boolean;
  allowVideo?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<{ url: string; video: boolean } | null>(null);

  useEffect(() => () => { if (media) URL.revokeObjectURL(media.url); }, [media]);

  return (
    <figure className={`photo ${className}`}>
      {media &&
        (media.video ? (
          <video src={media.url} muted loop playsInline autoPlay />
        ) : (
          <img src={media.url} alt="" />
        ))}
      {!media && (
        <div className="ph-label">
          {icon && <PhotoIcon />}
          <b>{title}</b>
          <span>{hint}</span>
        </div>
      )}
      <button className="add" type="button" onClick={() => input.current?.click()}>
        {media ? "Change" : "Add photo"}
      </button>
      <input
        ref={input}
        className="pick"
        type="file"
        accept={allowVideo ? "image/*,video/*" : "image/*"}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setMedia({ url: URL.createObjectURL(f), video: f.type.startsWith("video/") });
        }}
      />
    </figure>
  );
}
