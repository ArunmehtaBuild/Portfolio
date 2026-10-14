import { Fragment, type ReactNode } from "react";

// Renders the two inline marks allowed in src/data: **bold** and [label](https://url).
const TOKEN = /\*\*(.+?)\*\*|\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g;

export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const at = match.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    if (match[1]) {
      parts.push(<strong key={at} className="font-semibold">{match[1]}</strong>);
    } else {
      parts.push(
        <a key={at} href={match[3]} className="prose-link" target="_blank" rel="noreferrer">
          {match[2]}
        </a>,
      );
    }
    last = at + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}
