import type { Metadata } from "next";
import { getArticles } from "@/lib/blog";
import BlogPage from "./BlogPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Blog de inglés",
  description: "Artículos, guías y recursos para mejorar tu inglés con Linguafly.",
};

export default async function Page() {
  const articles = await getArticles(1000);
  return <BlogPage articles={articles} />;
}
