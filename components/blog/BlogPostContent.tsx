"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPostContentProps {
  content: string;
  className?: string;
}

export function BlogPostContent({ content, className = "" }: BlogPostContentProps) {
  return (
    <div className={`prose prose-slate max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom image rendering with Next.js Image optimization
          img: ({ node, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              {...props}
              alt={props.alt || "Blog image"}
              className="rounded-lg"
              loading="lazy"
            />
          ),
          // Custom link rendering to open external links in new tab
          a: ({ node, ...props }) => {
            const isExternal = props.href?.startsWith("http");
            return (
              <a
                {...props}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
