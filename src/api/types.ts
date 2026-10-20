/**
 * Типи, що відповідають структурі Nobel Prize API v2.1.
 * Джерело: https://api.nobelprize.org/2.1/
 */

/** Локалізований рядок (англійська, шведська, норвезька). */
export interface Localized {
  en?: string;
  se?: string;
  no?: string;
}

/** Географічне місце (місто, країна, континент). */
export interface LocationPlace {
  city?: Localized;
  country?: Localized;
  cityNow?: Localized & {
    sameAs?: string[];
    latitude?: string;
    longitude?: string;
  };
  countryNow?: Localized & {
    sameAs?: string[];
    latitude?: string;
    longitude?: string;
  };
  continent?: Localized;
  locationString?: Localized;
}

/** Подія життя лауреата (народження або смерть). */
export interface LifeEvent {
  date?: string;
  year?: string;
  place?: LocationPlace;
}

/** Організація, з якою повʼязана премія. */
export interface Affiliation {
  name?: Localized;
  nameNow?: Localized;
  city?: Localized;
  country?: Localized;
  locationString?: Localized;
}

/** Посилання, що повертає API. */
export interface ApiLink {
  rel?: string;
  href?: string;
  action?: string;
  types?: string;
  title?: string;
  class?: string[];
}

/** Нобелівська премія лауреата. */
export interface NobelPrize {
  awardYear: string;
  category: Localized;
  categoryFullName: Localized;
  sortOrder?: string;
  portion?: string;
  dateAwarded?: string;
  prizeStatus?: string;
  motivation?: Localized;
  prizeAmount?: number;
  prizeAmountAdjusted?: number;
  affiliations?: Affiliation[];
  links?: ApiLink[];
}

/** Лауреат Нобелівської премії. */
export interface Laureate {
  id: string;
  knownName?: Localized;
  givenName?: Localized;
  familyName?: Localized;
  fullName?: Localized;
  fileName?: string;
  gender?: string;
  birth?: LifeEvent;
  death?: LifeEvent;
  wikipedia?: { slug?: string; english?: string };
  wikidata?: { id?: string; url?: string };
  sameAs?: string[];
  links?: ApiLink[];
  nobelPrizes?: NobelPrize[];
}

/** Метадані відповіді (offset, limit, count тощо). */
export interface ApiMeta {
  offset?: number;
  limit?: number;
  count?: number;
  [key: string]: unknown;
}

/** Посилання пагінації. */
export interface PaginationLinks {
  first?: string;
  self?: string;
  next?: string;
  prev?: string;
  last?: string;
}

/** Відповідь ендпоінта /2.1/laureates. */
export interface LaureatesResponse {
  laureates: Laureate[];
  meta?: ApiMeta;
  links?: PaginationLinks;
}
