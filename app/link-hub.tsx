"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type HubLink = { title: string; url: string };

type ShareTarget = { title: string; url: string; isProfile: boolean };

const noSubscribe = () => () => {};

/** The address this page is served from; empty during server rendering. */
function useOrigin() {
  return useSyncExternalStore(
    noSubscribe,
    () => window.location.origin,
    () => "",
  );
}

function Icon({ children, size = 16 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const ShareIcon = () => (
  <Icon>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
  </Icon>
);

const MoreIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </Icon>
);

const CloseIcon = ({ size }: { size?: number }) => (
  <Icon size={size}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Icon>
);

const CopyIcon = () => (
  <Icon size={14}>
    <rect width="14" height="14" x="8" y="8" rx="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </Icon>
);

const CheckIcon = () => (
  <Icon size={14}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

const ChatIcon = () => (
  <Icon>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </Icon>
);

const SendIcon = () => (
  <Icon>
    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
    <path d="m21.854 2.147-10.94 10.939" />
  </Icon>
);

const OpenIcon = () => (
  <Icon>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </Icon>
);

const actionClass =
  "flex w-full items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-left text-sm font-medium text-white transition-colors hover:bg-white/10";

function ShareDialog({
  target,
  onClose,
}: {
  target: ShareTarget;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(target.url);
      setCopied(true);
    } catch {
      // Clipboard access can be refused; leave the text selected to copy by hand.
      inputRef.current?.select();
    }
  };

  const text = `Kunjungi tautan ${target.title}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}:\n${target.url}`)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(target.url)}&text=${encodeURIComponent(text)}`;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="share-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-3xl bg-[#14283a] p-6 text-white shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 id="share-title" className="text-lg font-bold tracking-tight">
          {target.isProfile ? "Bagikan Profil" : "Bagikan Tautan"}
        </h2>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Tutup"
          className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <CloseIcon size={20} />
        </button>
      </div>

      <p className="mt-4 text-sm font-semibold">{target.title}</p>

      <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 pl-3">
        <input
          ref={inputRef}
          readOnly
          value={target.url}
          aria-label="Alamat tautan"
          className="min-w-0 flex-1 truncate bg-transparent text-xs text-white/80 outline-none"
        />
        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-ocean px-3 py-2 text-xs font-semibold transition-colors hover:bg-ocean-deep"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span aria-live="polite">{copied ? "Tersalin!" : "Salin"}</span>
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {!target.isProfile && (
          <a
            href={target.url}
            target="_blank"
            rel="noopener noreferrer"
            className={actionClass}
          >
            <span className="text-ocean-light">
              <OpenIcon />
            </span>
            Buka Tautan
          </a>
        )}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={actionClass}
        >
          <span className="text-ocean-light">
            <ChatIcon />
          </span>
          Bagikan ke WhatsApp
        </a>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={actionClass}
        >
          <span className="text-ocean-light">
            <SendIcon />
          </span>
          Bagikan ke Telegram
        </a>
      </div>
    </dialog>
  );
}

export function LinkHub({
  name,
  kkn,
  tagline,
  links,
}: {
  name: string;
  kkn: string;
  tagline: string;
  links: HubLink[];
}) {
  const origin = useOrigin();
  const [target, setTarget] = useState<ShareTarget | null>(null);
  const [showDomain, setShowDomain] = useState(true);

  const profileTarget: ShareTarget = {
    title: `${name} - ${kkn}`,
    url: origin,
    isProfile: true,
  };

  return (
    <>
      <div className="relative flex min-h-screen w-full max-w-[580px] flex-col bg-[#0b2a3f]/25 px-4 py-6 backdrop-blur-xl sm:min-h-[92vh] sm:rounded-[36px] sm:px-7 sm:py-8 sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/20 via-white/5 to-transparent sm:rounded-t-[36px]" />

        <div className="relative z-10 flex w-full flex-col items-center">
          <div className="mb-4 flex w-full items-center justify-end">
            <button
              type="button"
              onClick={() => setTarget(profileTarget)}
              title="Bagikan Halaman"
              aria-label="Bagikan Halaman"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white/90 shadow-md backdrop-blur-md transition-all hover:bg-black/50 hover:text-white active:scale-95"
            >
              <ShareIcon />
            </button>
          </div>

          <header className="mt-1 mb-6 flex flex-col items-center text-center">
            <Image
              src="/avatar.webp"
              alt="Maskot penyu Selayar Berkibar"
              width={112}
              height={112}
              preload
              className="h-24 w-24 rounded-full border-2 border-white/40 object-cover shadow-xl sm:h-28 sm:w-28"
            />
            <h1 className="mt-3.5 text-2xl font-extrabold drop-shadow-md sm:text-[26px]">
              {name}
            </h1>
            <p className="mt-1 rounded-full bg-white px-3 py-0.5 text-[11px] font-semibold tracking-wide text-ocean">
              {kkn}
            </p>
            <p className="mt-1 max-w-[340px] px-2 text-[15px] leading-relaxed font-medium text-white/95 drop-shadow-sm sm:text-[18px]">
              {tagline}
            </p>
          </header>

          <ul className="mt-1 w-full space-y-3.5">
            {links.map((link) => (
              <li
                key={link.title}
                className="relative w-full transition-transform duration-200 hover:-translate-y-0.5"
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[58px] w-full items-center justify-center rounded-3xl bg-ocean px-14 py-3.5 text-center text-[13.5px] leading-snug font-bold tracking-wide text-white uppercase shadow-md transition-all duration-300 hover:bg-ocean-deep hover:shadow-xl active:scale-[0.98] sm:text-[14.5px]"
                >
                  {link.title}
                </a>
                <button
                  type="button"
                  onClick={() =>
                    setTarget({
                      title: link.title,
                      url: new URL(link.url, window.location.href).href,
                      isProfile: false,
                    })
                  }
                  title="Opsi Tautan"
                  aria-label={`Opsi tautan ${link.title}`}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <MoreIcon />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-8" />
        {showDomain && origin && (
          <div className="sticky bottom-4 z-30 mx-auto mb-3 flex items-center rounded-full border border-white/40 bg-white/95 px-4 py-2 text-zinc-900 shadow-lg transition-transform hover:scale-105">
            <button
              type="button"
              onClick={() => setTarget(profileTarget)}
              className="text-xs font-bold tracking-tight transition-colors hover:text-ocean"
            >
              {new URL(origin).host}
            </button>
            <button
              type="button"
              onClick={() => setShowDomain(false)}
              aria-label="Tutup"
              className="ml-1 -mr-1 p-1 text-zinc-500 transition-colors hover:text-zinc-900"
            >
              <CloseIcon size={14} />
            </button>
          </div>
        )}
        <footer className="flex items-center justify-center gap-2 pb-2 text-[12px] text-white/85">
          <span>KKN {name}</span>
          <span aria-hidden="true">•</span>
          <a
            href={links[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white underline"
          >
            Lihat Analisis Tim
          </a>
        </footer>
      </div>

      {origin && (
        <div className="fixed right-6 bottom-6 z-40 hidden flex-col items-center gap-1.5 p-3.5 lg:flex">
          <span className="text-[11px] font-medium tracking-tight text-white drop-shadow">
            View on mobile
          </span>
          <div className="rounded-xl bg-white p-1.5">
            <QRCodeSVG
              value={origin}
              size={64}
              level="M"
              title="Kode QR untuk membuka halaman ini di ponsel"
            />
          </div>
        </div>
      )}

      {target && (
        <ShareDialog target={target} onClose={() => setTarget(null)} />
      )}
    </>
  );
}
