// app/blogs/[slug]/page.tsx (server component)
import fs from "fs";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import OnThisPage from "@/components/onthispage";
import Link from "next/link";
import {ChevronLeft} from "lucide-react";
import React from "react";

interface BlogFrontmatter {
  title: string;
  description: string;
  author: string;
  date: string;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filepath = `articles/${slug}.md`;

  if (!fs.existsSync(filepath)) notFound();

  const fileContent = fs.readFileSync(filepath, "utf-8");
  const { content, data } = matter(fileContent) as unknown as {
    content: string;
    data: BlogFrontmatter;
  };

  // ✅ FIXED PROCESSOR (NO rehype-document, rehype-format)
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypePrettyCode, {
      theme: "material-theme-darker",
      transformers: [
        transformerCopyButton({
          visibility: "always",
          feedbackDuration: 3000,
        }),
      ],
    })
    .use(rehypeStringify);

  const htmlContent = (await processor.process(content)).toString();

  return (
    <>
     
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#111] text-gray-200 py-12 px-4 sm:px-6 md:px-10 lg:px-16 font-[Inter,sans-serif]">
      {/* Back Button */}
      <Link href="/blog" className="inline-block mb-8 mt-16">
        <button className="flex items-center gap-2 border border-gray-700 text-gray-300 bg-black/50 hover:bg-zinc-800 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm">
          <ChevronLeft size={20} />
          Back to Blogs
        </button>
      </Link>

      {/* Blog Layout */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Main Content */}
        <div className="flex-1 p-6 bg-zinc-900/70 border border-zinc-800 rounded-2xl shadow-lg shadow-black/40 backdrop-blur-md">
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white mb-3">
              {data.title}
            </h1>
            {data.description && (
              <p className="italic text-zinc-400 border-l-4 border-blue-600 pl-4 mt-3 text-base sm:text-lg">
                “{data.description}”
              </p>
            )}
          </header>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 mb-6">
            <span className="border border-zinc-700 text-zinc-400 bg-zinc-800/70 px-3 py-1 rounded-md">
              By {data.author}
            </span>
            <span className="hidden sm:block h-4 w-px bg-zinc-700" />
            <span className="text-zinc-500">{data.date}</span>
          </div>

          <hr className="border-zinc-800 mb-8" />

          {/* Blog Content */}
          <article
            className="prose prose-invert max-w-none text-zinc-300 leading-relaxed prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-blockquote:border-l-blue-500 prose-code:bg-zinc-800/80 prose-code:text-blue-300 prose-code:px-2 prose-code:py-1 prose-code:rounded-md"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        {/* Sidebar: Hidden on mobile */}
        <aside className="hidden lg:block w-72 shrink-0">
          <OnThisPage htmlContent={htmlContent} />
        </aside>
      </div>
    </div>
    </>
  );
}
