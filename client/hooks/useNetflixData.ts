import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Content, CategoryWithContents } from "@shared/api";

/**
 * Busca o conteúdo marcado como hero (banner principal)
 */
export function useHeroContent() {
  return useQuery<Content | null>({
    queryKey: ["hero-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contents")
        .select("*")
        .eq("is_hero", true)
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching hero content:", error);
        throw error;
      }

      return data;
    },
  });
}

/**
 * Busca todas as categorias com seus conteúdos associados,
 * ordenadas por display_order
 */
export function useCategories() {
  return useQuery<CategoryWithContents[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(
          `
          *,
          category_contents (
            *,
            contents (*)
          )
        `
        )
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      // Ordenar os conteúdos dentro de cada categoria
      return (data ?? []).map((category: CategoryWithContents) => ({
        ...category,
        category_contents: (category.category_contents ?? []).sort(
          (a, b) => a.display_order - b.display_order
        ),
      }));
    },
  });
}
