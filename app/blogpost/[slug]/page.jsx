import React from "react";
import fs from "fs";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { Button } from '@/components/ui/button'
import { ChevronLeft } from "lucide-react";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import OnThisPage from "@/components/onthispage";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link";


export default async function Page({ params }) {
  const { slug } = await params; // ✅ if params is async
  const filepath = `articles/${slug}.md`;

  if (!fs.existsSync(filepath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filepath, "utf-8");
  const { content, data } = matter(fileContent);

  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeDocument, { title: data.title || "👋🌍" })
    .use(rehypeFormat)
    .use(rehypeStringify)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypePrettyCode, {
      theme: "material-theme-darker",
      transformers: [
        transformerCopyButton({
          visibility: "always",
          feedbackDuration: 3000,
        }),
      ],
    });

  const htmlContent = (await processor.process(content)).toString();
  return (
 <div className="blogs-container min-h-screen bg-linear-to-br from-[#050505] via-[#0a0a0a] to-[#111] text-gray-200 py-16 px-6 md:px-16">
  <Link href={`/Blogs`} className="w-full block mb-8">
    <Button
      variant="outline"
      className="flex items-center bg-black cursor-pointer gap-2 border-gray-600 text-gray-300 hover:bg-black-800 hover:text-white transition-colors duration-200"
    >
      <ChevronLeft size={20} />
      Back to Blogs
    </Button>
  </Link>

  <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
    {/* Blog Content Section */}
    <div className="flex-1 p-4">
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-md shadow-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {data.title}
          </CardTitle>

          <CardDescription className="italic text-zinc-400 border-l-4 border-blue-600 pl-4 mt-3">
            “{data.description}”
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <Badge
              variant="outline"
              className="border-zinc-700 text-zinc-400 bg-zinc-800/50 hover:bg-zinc-800"
            >
              By {data.author}
            </Badge>
            <Separator orientation="vertical" className="h-4 bg-zinc-700 hidden sm:block" />
            <span className="text-zinc-500">{data.date}</span>
          </div>

          <Separator className="bg-zinc-800" />

          <div
            className="prose prose-zinc dark:prose-invert max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </CardContent>
      </Card>
    </div>

    {/* "On This Page" - Hidden on Mobile */}
    <div className="hidden lg:block w-72 shrink-0">
      <OnThisPage htmlContent={htmlContent} />
    </div>
  </div>
</div>

  );
}
