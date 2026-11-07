import Image from "next/image";
import { LinkHub, type HubLink } from "./link-hub";

const links: HubLink[] = [
  {
    title: "Booklet Tim Daeng Mamangung",
    url: "https://drive.google.com/file/d/1J73yLZ2aaSpwFojJykgUkhB_yKnr_zVD/view?usp=sharing",
  },
  {
    title: "RAB",
    url: "https://docs.google.com/spreadsheets/d/1czx3lbdV7cfJQj_UDSMr4wi5qfJ2IDN2Wj2Nz3euB-w/edit?usp=sharing",
  },
  {
    title: "Program Kerja",
    url: "https://docs.google.com/spreadsheets/d/1Re7FHb9ukkfovvKnJJ1NpyGfOEh_y10Hgbgv__d-svs/edit?usp=sharing",
  },
  {
    title: "CV Anggota",
    url: "https://drive.google.com/drive/folders/1960zotFhcSsEz3JC2SvuW7Qe1py0pb67?usp=sharing",
  },
  {
    title: "Surat Komitmen",
    url: "https://drive.google.com/file/d/1nxnxblIp8tsXebGIRflYZDOFtNmoZfbk/view?usp=sharing",
  },
  {
    title: "Prototipe SINAR",
    url: "https://drive.google.com/file/d/1A56GZSjuqX7xvDg8fooEScWyKGkqV4gb/view?usp=sharing",
  },
  {
    title: "Prototipe Bioaktivator",
    url: "https://docs.google.com/document/d/1Y39yks8E0CKaU_5V-pReW1XgnzCn6C-NKi0XlyOJ67Y/edit?usp=sharing",
  },
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full items-start justify-center selection:bg-ocean selection:text-white sm:px-4 sm:py-6 md:py-10">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="/bg.webp"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <LinkHub
        name="Daeng Mamangung"
        kkn="KKN Selayar Berkibar"
        tagline="Berpayung Rahmat Tuhan, Selamat Datang di Tanah Pelaut Berdoa"
        links={links}
      />
    </main>
  );
}
