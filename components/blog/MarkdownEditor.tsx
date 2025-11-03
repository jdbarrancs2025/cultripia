"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BlogPostContent } from "./BlogPostContent";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  minHeight?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content in Markdown...",
  label,
  minHeight = "400px",
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "write" | "preview")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="font-mono"
            style={{ minHeight }}
          />
          <div className="mt-2 text-xs text-muted-foreground">
            <p className="font-semibold mb-1">Markdown Cheat Sheet:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div><code># Heading 1</code></div>
              <div><code>## Heading 2</code></div>
              <div><code>**bold**</code></div>
              <div><code>*italic*</code></div>
              <div><code>[link](url)</code></div>
              <div><code>![image](url)</code></div>
              <div><code>- List item</code></div>
              <div><code>`code`</code></div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preview" className="mt-2">
          <div
            className="border rounded-md p-4 bg-muted/30"
            style={{ minHeight }}
          >
            {value ? (
              <BlogPostContent content={value} />
            ) : (
              <p className="text-muted-foreground italic">
                Nothing to preview yet. Switch to Write tab to add content.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
