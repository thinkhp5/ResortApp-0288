import { Fragment } from "react";
import { Link } from "wouter";

/** Tiny, safe markdown subset: **bold**, *italic*, [label](/path), bullet & numbered lists, paragraphs. */
function inline(text: string, keyBase: string) {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*\s][^*]*\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyBase}-${i++}`;
    if (tok.startsWith("**")) out.push(<strong key={key} className="font-semibold text-bone">{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("[")) {
      const lm = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!;
      const href = lm[2]!;
      out.push(
        href.startsWith("/") ? (
          <Link key={key} to={href} className="text-sand underline underline-offset-2">{lm[1]}</Link>
        ) : href.startsWith("http") ? (
          <a key={key} href={href} target="_blank" rel="noreferrer" className="text-sand underline underline-offset-2">{lm[1]}</a>
        ) : (
          lm[1]
        ),
      );
    } else out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ text }: { text: string }) {
  const blocks = text.replace(/\r/g, "").split(/\n{2,}/);
  return (
    <div className="space-y-2.5">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter((l) => l.trim());
        if (!lines.length) return null;
        const isList = lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l));
        if (isList) {
          const ordered = /^\s*\d+\./.test(lines[0]!);
          const Tag = ordered ? "ol" : "ul";
          return (
            <Tag key={bi} className={ordered ? "list-decimal space-y-1 pl-5" : "space-y-1 pl-1"}>
              {lines.map((l, li) => (
                <li key={li} className={ordered ? "" : "flex gap-2"}>
                  {!ordered && <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-sand" />}
                  <span>{inline(l.replace(/^\s*([-*•]|\d+\.)\s+/, ""), `${bi}-${li}`)}</span>
                </li>
              ))}
            </Tag>
          );
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {inline(l.replace(/^#+\s*/, ""), `${bi}-${li}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
