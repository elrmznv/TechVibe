export type Language = "AZ" | "EN" | "RU";

export interface ServiceDetail {
  id: string;
  name: { AZ: string; EN: string; RU: string };
  shortDesc: { AZ: string; EN: string; RU: string };
  longDesc: { AZ: string; EN: string; RU: string };
  iconName: string; // lucide icon identifier
  technologies: string[];
  duration: { AZ: string; EN: string; RU: string };
  priceEstimate: { AZ: string; EN: string; RU: string };
  architecture: {
    AZ: string[];
    EN: string[];
    RU: string[];
  };
}

export interface TranslationDictionary {
  navbar: {
    services: string;
    manifesto: string;
    consultant: string;
    team: string;
    contact: string;
    consultButton: string;
  };
  hero: {
    tagline: string;
    titleFirst: string;
    titleHighlight: string;
    titleLast: string;
    subtitle: string;
    ctaConsult: string;
    ctaServices: string;
  };
  manifesto: {
    badge: string;
    title: string;
    highlightText: string;
    mainText: string;
    paragraph2: string;
    quote: string;
    quoteAuthor: string;
    statRustSpeed: string;
    statRustDesc: string;
    statMojoSpeed: string;
    statMojoDesc: string;
    statReliability: string;
    statReliabilityDesc: string;
  };
  servicesSection: {
    badge: string;
    title: string;
    subtitle: string;
    modalTechTitle: string;
    modalArchTitle: string;
    modalPriceTitle: string;
    modalDurationTitle: string;
    modalCloseBtn: string;
    modalQuoteBtn: string;
  };
  consultantSection: {
    badge: string;
    title: string;
    subtitle: string;
    placeholder: string;
    sendBtn: string;
    loadingText: string;
    disclaimer: string;
    welcomeMsg: string;
    suggestion1: string;
    suggestion2: string;
    suggestion3: string;
  };
  contactModal: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    msgLabel: string;
    submitBtn: string;
    successMsg: string;
  };
}
