type PageHeroProps = {
  eyebrow: string;
  title: string;
  text: string;
  image?: string;
  imageAlt?: string;
};

export function PageHero({ eyebrow, title, text, image, imageAlt }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div>
        <p className="eyebrow">
          <span />
          {eyebrow}
        </p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {image && <img src={image} alt={imageAlt ?? "Espace commercial propre et accueillant"} />}
    </section>
  );
}
