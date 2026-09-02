type Community = {
  name: string;
  image: string;
};

// Swap these `image` paths for the generated renders once ready — filenames
// are already conventioned to match (public/images/communities/*.jpg).
const COMMUNITIES: Community[] = [
  { name: "Isimi Lagos", image: "/images/communities/isimi-lagos.jpg" },
  { name: "Urban Prime", image: "/images/communities/urban-prime.jpg" },
  { name: "Lakowe Country Reserve", image: "/images/communities/lakowe-country-reserve.jpg" },
];

export default function CommunityStrip() {
  return (
    <section id="communities" className="bg-forest">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {COMMUNITIES.map((c) => (
          <a
            key={c.name}
            href="#"
            className="group relative aspect-[4/3] overflow-hidden border-forest-dark/40 md:aspect-auto md:h-[420px] md:border-r last:border-r-0"
          >
            <img
              src={c.image}
              alt={c.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(8,20,14,0.55) 0%, rgba(8,20,14,0.05) 35%, rgba(8,20,14,0.05) 100%)",
              }}
            />
            <span className="absolute left-6 top-6 inline-flex items-center gap-2 text-lg font-medium text-warm-white md:text-xl">
              {c.name}
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
