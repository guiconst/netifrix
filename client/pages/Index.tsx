import { useState } from "react";
import { useHeroContent, useCategories } from "@/hooks/useNetflixData";
import type { CategoryWithContents } from "@shared/api";

// TMDB image base URLs
const TMDB_IMG = "https://image.tmdb.org/t/p";
const BACKDROP = (path: string) => `${TMDB_IMG}/original${path}`;
const POSTER = (path: string) => `${TMDB_IMG}/w500${path}`;
const BACKDROP_W780 = (path: string) => `${TMDB_IMG}/w780${path}`;

export default function Index() {
  const [scrolled, setScrolled] = useState(false);

  // ─── Fetch data from Supabase ───────────────────────────────────────────
  const { data: heroContent, isLoading: heroLoading } = useHeroContent();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Track navbar scroll
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setScrolled(window.scrollY > 50);
    }, { passive: true });
  }

  const playIcon = (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 18V0L16 9L0 18Z" fill="currentColor"/>
    </svg>
  );

  const infoIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2"/>
      <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="8" r="1.2" fill="currentColor"/>
    </svg>
  );

  const chevronRight = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // ─── Content row renderer ──────────────────────────────────────────────────

  const ContentRow = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="px-4 md:px-12 lg:px-16 group/section">
      <div className="flex items-center gap-1 mb-2 md:mb-4">
        <h2 className="text-[#E5E5E5] text-sm md:text-base lg:text-xl font-bold">{title}</h2>
        <span className="text-[#54B9C5] text-xs font-semibold opacity-0 group-hover/section:opacity-100 transition-opacity flex items-center gap-0.5">
          Explorar todos {chevronRight}
        </span>
      </div>
      <div className="flex gap-1 md:gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {children}
      </div>
    </section>
  );

  // ─── Backdrop card (landscape) ─────────────────────────────────────────────

  const BackdropCard = ({ title, src }: { title: string; src: string }) => (
    <div className="flex-shrink-0 w-[230px] md:w-[280px] lg:w-[310px] group/card cursor-pointer">
      <div className="relative overflow-hidden rounded-[4px]">
        <img
          src={src}
          alt={title}
          className="w-full aspect-video object-cover transition-transform duration-300 group-hover/card:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm font-semibold drop-shadow-lg">{title}</p>
        </div>
      </div>
    </div>
  );

  // ─── Poster card (portrait) ────────────────────────────────────────────────

  const PosterCard = ({ title, src, rank }: { title: string; src: string; rank?: number }) => (
    <div className="flex-shrink-0 group/card cursor-pointer relative">
      <div className="flex items-end">
        {rank !== undefined && (
          <span
            className="text-[100px] md:text-[140px] font-black leading-none select-none mr-[-14px] z-10"
            style={{
              color: "transparent",
              WebkitTextStroke: "3px #808080",
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
          >
            {rank}
          </span>
        )}
        <div className="relative overflow-hidden rounded-[4px] w-[130px] md:w-[160px]">
          <img
            src={src}
            alt={title}
            className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover/card:scale-110"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );

  // ─── Continue watching card ────────────────────────────────────────────────

  const ContinueCard = ({ title, src, label, progress }: { title: string; src: string; label: string; progress: number }) => (
    <div className="flex-shrink-0 w-[230px] md:w-[280px] lg:w-[310px] group/card cursor-pointer">
      <div className="relative overflow-hidden rounded-t-[4px]">
        <img
          src={src}
          alt={title}
          className="w-full aspect-video object-cover transition-transform duration-300 group-hover/card:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/card:opacity-100 transition-opacity" />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <svg width="16" height="18" viewBox="0 0 16 18" fill="white"><path d="M0 18V0L16 9L0 18Z"/></svg>
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="w-full h-[3px] bg-[#404040]">
        <div className="h-full bg-[#E50914] rounded-sm" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center justify-between px-3 py-2 bg-[#181818] rounded-b-[4px]">
        <span className="text-[#A3A3A3] text-xs font-medium">{label}</span>
        <span className="text-[#A3A3A3] text-xs font-medium">{title}</span>
      </div>
    </div>
  );

  // ─── Skeleton loaders ──────────────────────────────────────────────────────

  const SkeletonRow = () => (
    <section className="px-4 md:px-12 lg:px-16">
      <div className="h-5 w-48 bg-[#2a2a2a] rounded mb-4 animate-pulse" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[230px] md:w-[280px] lg:w-[310px]">
            <div className="w-full aspect-video bg-[#2a2a2a] rounded animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );

  const SkeletonHero = () => (
    <div className="relative w-full">
      <div className="relative w-full h-[56vw] min-h-[400px] max-h-[800px] overflow-hidden bg-[#1a1a1a] animate-pulse">
        <div className="absolute bottom-[20%] left-4 md:left-12 lg:left-16 w-[90%] md:w-[45%] space-y-4">
          <div className="h-4 w-20 bg-[#2a2a2a] rounded" />
          <div className="h-12 w-64 bg-[#2a2a2a] rounded" />
          <div className="h-4 w-48 bg-[#2a2a2a] rounded" />
          <div className="h-16 w-full bg-[#2a2a2a] rounded" />
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-[#2a2a2a] rounded" />
            <div className="h-10 w-44 bg-[#2a2a2a] rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Render category based on card_type ────────────────────────────────────

  const renderCategory = (category: CategoryWithContents) => {
    const items = category.category_contents ?? [];

    if (items.length === 0) return null;

    return (
      <ContentRow key={category.id} title={category.name}>
        {items.map((item) => {
          const content = item.contents;
          if (!content) return null;

          switch (category.card_type) {
            case "poster":
              return (
                <PosterCard
                  key={item.id}
                  title={content.title}
                  src={content.poster_path ? POSTER(content.poster_path) : ""}
                  rank={item.rank ?? undefined}
                />
              );
            case "continue":
              return (
                <ContinueCard
                  key={item.id}
                  title={content.title}
                  src={content.backdrop_path ? BACKDROP_W780(content.backdrop_path) : ""}
                  label={item.label ?? ""}
                  progress={item.progress ?? 0}
                />
              );
            case "backdrop":
            default:
              return (
                <BackdropCard
                  key={item.id}
                  title={content.title}
                  src={content.backdrop_path ? BACKDROP_W780(content.backdrop_path) : ""}
                />
              );
          }
        })}
      </ContentRow>
    );
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* ─── Netflix Navbar ──────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 lg:px-16 py-3 transition-all duration-500 ${
          scrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 to-transparent"
        }`}
      >
        <div className="flex items-center gap-6 md:gap-10">
        {/* Netflix Logo */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
          alt="Netflix"
          className="w-20 md:w-24"
        />

          <div className="hidden md:flex items-center gap-5">
            {["Início", "Séries", "Filmes", "Bombando", "Minha Lista", "Navegar por Idiomas"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[#E5E5E5] text-[13px] font-normal hover:text-[#B3B3B3] transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-5">
          {/* Search icon */}
          <button className="text-white hover:text-[#B3B3B3] transition" aria-label="Buscar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
          {/* Bell icon */}
          <button className="text-white hover:text-[#B3B3B3] transition" aria-label="Notificações">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          {/* Profile avatar */}
          <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center cursor-pointer">
            <span className="text-white text-sm font-bold">U</span>
          </div>
        </div>
      </nav>

      {/* ─── Hero Banner ─────────────────────────────────────────────────────── */}
      {heroLoading ? (
        <SkeletonHero />
      ) : heroContent ? (
        <div className="relative w-full">
          <div className="relative w-full h-[56vw] min-h-[400px] max-h-[800px] overflow-hidden">
            <img
              src={heroContent.backdrop_path ? BACKDROP(heroContent.backdrop_path) : ""}
              alt={heroContent.title}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />

            {/* Vignette gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#141414] to-transparent" />

            {/* Hero content */}
            <div className="absolute bottom-[15%] md:bottom-[20%] left-4 md:left-12 lg:left-16 w-[90%] md:w-[45%] lg:w-[36%] space-y-4">
              {/* Netflix "N" series badge */}
              <div className="flex items-center gap-2">
                <span className="text-[#E50914] font-black text-xl tracking-[-2px]">N</span>
                <span className="text-[#999] text-[11px] font-semibold tracking-[3px] uppercase">
                  {heroContent.content_type === "series" ? "S É R I E" : "F I L M E"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black leading-none tracking-tight drop-shadow-2xl">
                {heroContent.title}
              </h1>

              {/* Metadata */}
              <div className="flex items-center gap-3 text-sm">
                {heroContent.match_percentage && (
                  <span className="text-[#46D369] font-semibold">{heroContent.match_percentage}% relevante</span>
                )}
                {heroContent.year && <span className="text-[#BCBCBC]">{heroContent.year}</span>}
                {heroContent.rating && (
                  <span className="px-1.5 py-0.5 border border-[#808080] text-[#BCBCBC] text-[11px]">{heroContent.rating}</span>
                )}
                {heroContent.seasons && <span className="text-[#BCBCBC]">{heroContent.seasons}</span>}
              </div>

              {heroContent.description && (
                <p className="text-[#E5E5E5] text-sm md:text-base font-normal leading-relaxed line-clamp-3 drop-shadow-lg">
                  {heroContent.description}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button className="flex items-center gap-2 bg-white text-black px-5 py-2 md:px-7 md:py-2.5 rounded-[4px] font-bold text-sm md:text-base hover:bg-white/75 transition-all duration-200 active:scale-95">
                  {playIcon}
                  <span>Assistir</span>
                </button>

                <button className="flex items-center gap-2 bg-[#6D6D6E]/70 backdrop-blur-sm px-5 py-2 md:px-7 md:py-2.5 rounded-[4px] text-white font-bold text-sm md:text-base hover:bg-[#6D6D6E]/40 transition-all duration-200 active:scale-95">
                  {infoIcon}
                  <span>Mais Informações</span>
                </button>
              </div>
            </div>

            {/* Maturity rating badge */}
            {heroContent.rating && (
              <div className="absolute bottom-[15%] md:bottom-[20%] right-0 flex items-center">
                <div className="bg-[#333]/60 border-l-[3px] border-white/40 px-4 py-1">
                  <span className="text-white text-sm font-medium">{heroContent.rating}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* ─── Content Rows ────────────────────────────────────────────────────── */}
      <div className="space-y-6 md:space-y-10 -mt-16 relative z-10 pb-8">
        {categoriesLoading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          categories?.map((category) => renderCategory(category))
        )}
      </div>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="mt-8 pt-8 pb-8 px-4 md:px-12 lg:px-16">
        <div className="flex gap-4 mb-6">
          {/* Social icons */}
          {["facebook", "instagram", "twitter", "youtube"].map((social) => (
            <a key={social} href="#" className="text-white hover:text-[#B3B3B3] transition" aria-label={social}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </a>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            "Descrição de áudio", "Central de Ajuda", "Cartões pré-pagos", "Centro de mídia",
            "Relações com investidores", "Carreiras", "Termos de Uso", "Privacidade",
            "Avisos legais", "Preferências de cookies", "Informações corporativas", "Fale conosco",
          ].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#808080] text-[13px] hover:text-[#E5E5E5] transition-colors underline"
            >
              {link}
            </a>
          ))}
        </div>
        <button className="border border-[#808080] text-[#808080] text-[13px] px-2 py-1 hover:text-white hover:border-white transition mb-4">
          Código do serviço
        </button>
        <div className="text-[#808080] text-[11px]">
          © 1997-2024 Netflix, Inc.
        </div>
      </footer>
    </div>
   );
}