import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export async function GET() {
  try {
    const articlesDir = path.join(process.cwd(), "articles");
    const files = await fs.readdir(articlesDir);

    const blogs = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(articlesDir, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data } = matter(fileContent);
        return {
          ...data,
          slug: file.replace(/\.md$/, ""),
        };
      })
    );

    return NextResponse.json(blogs);
  } catch (error) {
      return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
