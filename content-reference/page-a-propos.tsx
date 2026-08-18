import { CTA, Footer, Header, PageHero } from "../components";

export default function About() {
  return <main>
    <Header />
    <PageHero eyebrow="À propos" title="Une approche simple, transparente et bien encadrée." text="BioAnlov offre un entretien ménager commercial fondé sur la constance, l’écoute et le respect de vos espaces." image="/images/garderie.webp" />
    <section className="content-section about-content">
      <div>
        <p className="eyebrow"><span /> Qui sommes-nous</p>
        <h2>Un service adapté à votre réalité.</h2>
      </div>
      <div>
        <p>BioAnlov accompagne les immeubles de bureaux, les CPE, les garderies et les restaurants avec des services d’entretien planifiés selon leurs besoins réels.</p>
        <p>Chaque mandat est défini clairement afin de respecter vos espaces, vos horaires et vos priorités. Notre objectif est de vous offrir un environnement propre, sain et accueillant, avec un service constant et attentif.</p>
      </div>
    </section>
    <CTA />
    <Footer />
  </main>;
}
