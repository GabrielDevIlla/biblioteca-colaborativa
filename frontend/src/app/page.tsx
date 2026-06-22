"use client";

import { BookX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BookCard } from "@/components/library/book-card";
import { BookDetailDialog } from "@/components/library/book-detail-dialog";
import {
  FilterPanel,
  type SortOption,
} from "@/components/library/filter-panel";
import { Header } from "@/components/library/header";
import { type Book, getBooks } from "@/lib/api";

export default function Page() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortOption>("relevancia");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    getBooks().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(books.map((b) => b.category));
    return Array.from(unique).sort();
  }, [books]);

  const openBook = (book: Book) => {
    setSelectedBook(book);
    setDetailOpen(true);
  };

  const toggleCategory = (category: string) =>
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );

  const toggleFavorite = (id: string) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );

  const resetFilters = () => {
    setSelectedCategories([]);
    setAvailableOnly(false);
    setMinRating(0);
    setSort("relevancia");
    setQuery("");
    setShowFavoritesOnly(false);
  };

  const filteredBooks = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = books.filter((book) => {
      if (showFavoritesOnly && !favorites.includes(book.id)) return false;
      if (q && !`${book.title} ${book.author}`.toLowerCase().includes(q))
        return false;
      if (
        selectedCategories.length &&
        !selectedCategories.includes(book.category)
      )
        return false;
      if (availableOnly && !book.available) return false;
      if (book.rating < minRating) return false;
      return true;
    });

    const sorted = [...result];
    switch (sort) {
      case "avaliacao":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "recentes":
        sorted.sort((a, b) => b.year - a.year);
        break;
      case "titulo":
        sorted.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
        break;
    }
    return sorted;
  }, [
    query,
    selectedCategories,
    availableOnly,
    minRating,
    sort,
    showFavoritesOnly,
    favorites,
    books,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando acervo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        query={query}
        onQueryChange={setQuery}
        favoritesCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly((v) => !v)}
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="mb-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-gold" />
            {books.filter((b) => b.available).length} títulos disponíveis agora
          </span>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Descubra seu próximo livro no acervo da equipe
          </h1>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            Explore a coleção interna, refine por editora e disponibilidade, e
            guarde seus favoritos para alugar quando quiser.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <div className="lg:top-24 lg:self-start">
            <FilterPanel
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              availableOnly={availableOnly}
              onAvailableOnlyChange={setAvailableOnly}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              sort={sort}
              onSortChange={setSort}
              onReset={resetFilters}
              resultCount={filteredBooks.length}
            />
          </div>

          <div>
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
                {filteredBooks.map((book, index) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    index={index}
                    isFavorite={favorites.includes(book.id)}
                    onToggleFavorite={toggleFavorite}
                    onOpen={openBook}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <BookX className="size-6" />
                </span>
                <p className="mt-4 font-medium">Nenhum livro encontrado</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tente ajustar os filtros ou limpar a busca.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <BookDetailDialog
        book={selectedBook}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        isFavorite={selectedBook ? favorites.includes(selectedBook.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
