"use client";

import React, { Fragment, type ReactNode } from "react";

function inlineMarkdown(value: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`|!?\[[^\]]+\]\([^)]+\))/g;
  return value.split(pattern).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    const image = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) return <img key={index} src={image[2]} alt={image[1]} loading="lazy" />;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2].trim();
      const safe = href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://") || href.startsWith("mailto:");
      return safe ? <a key={index} href={href}>{link[1]}</a> : <Fragment key={index}>{link[1]}</Fragment>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

const isTableDivider = (line: string) => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);

export default function BlogMarkdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n?/g, "\n").trim().split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }

    if (line.startsWith("```")) {
      const code: string[] = []; i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]);
      i++;
      blocks.push(<pre key={blocks.length}><code>{code.join("\n")}</code></pre>);
      continue;
    }
    if (i + 1 < lines.length && line.includes("|") && isTableDivider(lines[i + 1])) {
      const cells = (row: string) => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(cell => cell.trim());
      const headers = cells(line); i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().includes("|") && lines[i].trim()) rows.push(cells(lines[i++]));
      blocks.push(<div className="article-table-wrap" key={blocks.length}><table><thead><tr>{headers.map((cell, n) => <th key={n}>{inlineMarkdown(cell)}</th>)}</tr></thead><tbody>{rows.map((row, n) => <tr key={n}>{headers.map((_, c) => <td key={c}>{inlineMarkdown(row[c] || "")}</td>)}</tr>)}</tbody></table></div>);
      continue;
    }
    if (/^#{1,4}\s/.test(line)) {
      const level = line.match(/^#+/)?.[0].length || 2;
      const text = line.replace(/^#{1,4}\s+/, "");
      const Tag = (["h2", "h3", "h4", "h4"] as const)[level - 1];
      blocks.push(<Tag key={blocks.length}>{inlineMarkdown(text)}</Tag>); i++; continue;
    }
    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) quote.push(lines[i++].trim().replace(/^>\s?/, ""));
      blocks.push(<blockquote key={blocks.length}>{quote.map((item, n) => <p key={n}>{inlineMarkdown(item)}</p>)}</blockquote>);
      continue;
    }
    if (/^([-*_])\1\1+\s*$/.test(line)) { blocks.push(<hr key={blocks.length} />); i++; continue; }
    if (/^[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) items.push(lines[i++].trim().replace(/^[-*+]\s+/, ""));
      blocks.push(<ul key={blocks.length}>{items.map((item, n) => <li key={n}>{inlineMarkdown(item)}</li>)}</ul>);
      continue;
    }
    if (/^\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) items.push(lines[i++].trim().replace(/^\d+[.)]\s+/, ""));
      blocks.push(<ol key={blocks.length}>{items.map((item, n) => <li key={n}>{inlineMarkdown(item)}</li>)}</ol>);
      continue;
    }
    const paragraph = [line]; i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|>\s?|[-*+]\s+|\d+[.)]\s+|```)/.test(lines[i].trim())) {
      if (i + 1 < lines.length && lines[i].includes("|") && isTableDivider(lines[i + 1])) break;
      paragraph.push(lines[i].trim()); i++;
    }
    blocks.push(<p key={blocks.length}>{paragraph.map((part, n) => <Fragment key={n}>{n > 0 && <br />}{inlineMarkdown(part)}</Fragment>)}</p>);
  }
  return <div className="article-content">{blocks}</div>;
}
