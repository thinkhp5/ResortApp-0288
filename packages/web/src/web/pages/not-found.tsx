import { ButtonLink } from "../components/ui-kit";
import { useSeo } from "../hooks/use-seo";

export default function NotFound() {
  useSeo("Page not found");
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-6xl font-light">Lost at sea</h1>
      <p className="mt-4 max-w-md text-mist">The page you're looking for has drifted away. Let's get you back to shore.</p>
      <ButtonLink href="/" className="mt-8">Return home</ButtonLink>
    </section>
  );
}
