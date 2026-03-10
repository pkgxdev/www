import { Helmet } from "react-helmet";

interface PackageSEOProps {
  project: string;
  displayName?: string | null;
  description?: string | null;
  homepage?: string | null;
}

export default function PackageSEO({
  project,
  displayName,
  description,
  homepage,
}: PackageSEOProps) {
  const title = displayName
    ? `${displayName} (${project}) - pkgx Package`
    : `${project} - pkgx Package`;

  const desc = description
    ? description.slice(0, 160)
    : `Install and run ${project} instantly with pkgx. No setup required.`;

  const canonicalUrl = `https://pkgx.dev/pkgs/${project}/`;
  const ogImage = `https://pkgx.dev/pkgs/${project}.webp`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="pkgx" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@pkgxdev" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: displayName || project,
          description: desc,
          url: canonicalUrl,
          image: ogImage,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "macOS, Linux",
          ...(homepage ? { sameAs: homepage } : {}),
        })}
      </script>
    </Helmet>
  );
}
