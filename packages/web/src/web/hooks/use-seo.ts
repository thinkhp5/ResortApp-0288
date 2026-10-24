import { useEffect } from "react";

export function useSeo(title: string, description?: string) {
  useEffect(() => {
    document.title = title.includes("Lūana Kai") ? title : `${title} — Lūana Kai Resort & Villas`;
    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = "description";
        document.head.appendChild(tag);
      }
      tag.content = description;
    }
  }, [title, description]);
}
