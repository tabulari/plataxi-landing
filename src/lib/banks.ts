// Source: src/data/banks-colombia.csv (Superfinanciera, 2026-09-08 + wallets)
//
// NOMBRE is the legal/canonical name — the value that must survive a round-trip to
// Core's `COLOMBIAN_BANKS` validator (shared/constants/colombian_banks.py), so it is
// kept byte-identical to that list. DISPLAY_NAME is the short user-facing name shown in
// the selector; TYPE is "bank" (vigilado por Superfinanciera) or "wallet"
// (Nequi/Daviplata — plataformas de pago, no bancos vigilados). FEATURED marks the
// well-known entities shown first in the selector ("Los más conocidos"); the rest are
// grouped under "Otros". This is presentation-only and never touches `legal`.

export type BankType = "bank" | "wallet";

export interface BankOption {
  /** Legal/canonical name — persisted to bank_entity and validated by Core. */
  legal: string;
  /** Short name shown to the user in the selector. */
  display: string;
  type: BankType;
  /** Show in the "Los más conocidos" group first; others fall under "Otros". */
  featured: boolean;
}

export const BANK_OPTIONS: readonly BankOption[] = [
  { legal: "BANCOLOMBIA S.A. y/o BANCO DE COLOMBIA S.A.", display: "Bancolombia", type: "bank", featured: true },
  { legal: "BANCO DE BOGOTA.", display: "Banco de Bogotá", type: "bank", featured: true },
  { legal: "BANCO DAVIVIENDA S.A.", display: "Davivienda", type: "bank", featured: true },
  { legal: "BANCO BILBAO VIZCAYA ARGENTARIA COLOMBIA S.A. BBVA COLOMBIA", display: "BBVA", type: "bank", featured: true },
  { legal: "BANCO POPULAR S. A.", display: "Banco Popular", type: "bank", featured: true },
  { legal: "BANCO DE OCCIDENTE S. A.", display: "Banco de Occidente", type: "bank", featured: true },
  { legal: "BANCO CAJA SOCIAL", display: "Banco Caja Social", type: "bank", featured: true },
  { legal: "BANCO COMERCIAL AV VILLAS S.A. y/o BANCO DE AHORRO Y VIVIENDA AVVILLAS BANCO AV VILLAS O AV VILLAS", display: "AV Villas", type: "bank", featured: true },
  { legal: "BANCO AGRARIO DE COLOMBIA S.A. Y PODRA USAR EL NOMBRE BANAGRARIO", display: "Banco Agrario", type: "bank", featured: true },
  { legal: "BANCO FALABELLA S A", display: "Banco Falabella", type: "bank", featured: true },
  { legal: "ITAU CORPBANCA COLOMBIA S.A.", display: "Itaú", type: "bank", featured: true },
  { legal: "BANCO PICHINCHA S.A.", display: "Banco Pichincha", type: "bank", featured: true },
  { legal: "BANCO W S.A.", display: "Banco W", type: "bank", featured: true },
  { legal: "SCOTIABANK COLPATRIA S.A Y PODRA UTILIZAR CUALQUIERA DE LOSSIGUIENTES NOMBRES ABREVIADOS O SIGLAS BANCO COLPATRIA, SCOTIABANK,SCOTIABANK COLPATRIA, COLPATRIA SCOTIABANK, COLPATRIA MULTIBANCA,MULTIBANC", display: "Scotiabank Colpatria", type: "bank", featured: true },
  { legal: "BANCO GNB SUDAMERIS S.A. PUDIENDO UTILIZAR EL NOMBRE DE BANCOGNB SUDAMERIS O SUDAMERIS", display: "GNB Sudameris", type: "bank", featured: true },
  { legal: "BANCO DE LAS MICROFINANZAS BANCAMIA S.A.", display: "Bancamía", type: "bank", featured: true },
  { legal: "BANCO MUNDO MUJER S.A.", display: "Banco Mundo Mujer", type: "bank", featured: true },
  { legal: "BANCO SERFINANZA S.A", display: "Banco Serfinanza", type: "bank", featured: true },
  { legal: "BANCO COMPARTIR S.A.", display: "Banco Compartir", type: "bank", featured: true },
  { legal: "NEQUI S.A. COMPAÑIA DE FINANCIAMIENTO", display: "Nequi", type: "wallet", featured: true },
  { legal: "DAVIPLATA S.A.S.", display: "Daviplata", type: "wallet", featured: true },

  { legal: "MONTES DE BOLIVAR NELLY MARIA", display: "Montes de Bolívar", type: "bank", featured: false },
  { legal: "LIDER FINANZAS DE LA COSTA S.A.S", display: "Líder Finanzas", type: "bank", featured: false },
  { legal: "INVERSIONES G.R.G. S.A.S.", display: "G.R.G. Inversiones", type: "bank", featured: false },
  { legal: "JIMENEZ GALEANO BELSY PATRICIA", display: "Belsy Jiménez", type: "bank", featured: false },
  { legal: "CLINICREDITO.COM S.A.S.", display: "Clinicrédito", type: "bank", featured: false },
  { legal: "COOFINANCIERA SOLUCIONES S.A.S.", display: "Coofinanciera Soluciones", type: "bank", featured: false },
  { legal: "CVP ASESORIAS Y SERVICIOS S.A.S.", display: "CVP Asesorías", type: "bank", featured: false },
  { legal: "SERGIO RAMIREZ GARCIA COMUNICACIONES S. EN C.", display: "Comunicaciones Sergio Ramírez", type: "bank", featured: false },
  { legal: "CREDIAPP S.A.S.", display: "Crediapp", type: "bank", featured: false },
  { legal: "COOPERATIVA DE TAXI SIGLA COODETAX", display: "Coodetax", type: "bank", featured: false },
  { legal: "ROHENES RAMIREZ FELIPE SANTIAGO", display: "Felipe Rohenes", type: "bank", featured: false },
  { legal: "AB BUSINESS CAPITAL SAS", display: "AB Business Capital", type: "bank", featured: false },
  { legal: "HOLDING MASTER GROUP S.A.S.", display: "Holding Master Group", type: "bank", featured: false },
  { legal: "CENTRAL DE CREDITOS DEL CARIBE S.A.S. SIGLA CENCREDI S.A.S.", display: "Cencredi", type: "bank", featured: false },
  { legal: "LABOR DE LIBRANZA S.A.S.", display: "Labor de Libranza", type: "bank", featured: false },
  { legal: "COOPERATIVA DE LA INDUSTRIA ASEGURADORA COOPSEGUROS", display: "Coopseguros", type: "bank", featured: false },
  { legal: "PRESTYC S.A.S.", display: "Prestyc", type: "bank", featured: false },
  { legal: "COOPERATIVA MULTIACTIVA COONALFE-SIGLA COONALFE", display: "Coonalfe", type: "bank", featured: false },
  { legal: "CONSULTORIAS SERVICIOS Y TELECOMUNICACIONES S.A.S.", display: "Consercom", type: "bank", featured: false },
  { legal: "B.S.S. & CIA. S. EN C.", display: "B.S.S.", type: "bank", featured: false },
  { legal: "FONVALORES S. EN C. S.", display: "Fonvalores", type: "bank", featured: false },
  { legal: "FINANCIAL COUNSEL S.A.S.", display: "Financial Counsel", type: "bank", featured: false },
  { legal: "BANCO COOPERATIVO COOPCENTRAL SIGLA COOPCENTRAL", display: "Coopcentral", type: "bank", featured: false },
  { legal: "COOPERATIVA MULTIACTIVA DE LA AVIACION CIVIL COLOMBIANA CUYA SIGLA ES COOPEDAC", display: "Coopedac", type: "bank", featured: false },
  { legal: "BANCO CREDIFINANCIERA S.A", display: "Credifinanciera", type: "bank", featured: false },
  { legal: "CREDIFAMILIA COMPAÑIA DE FINANCIAMIENTO S.A.", display: "Credifamilia", type: "bank", featured: false },
  { legal: "FINANCIERA ANDINA S.A. FINANDINA COMPANIA DE FINANCIAMIENTOCOMERCIAL PODRA IGUALMENTE DENOMINARSE EN TODOS SUS ACTOS FINANCIERAANDINA S.A. O POR SU SIGLA FINANDINA", display: "Finandina", type: "bank", featured: false },
  { legal: "CREZCAMOS S.A. COMPAÑIA DE FINANCIAMIENTO", display: "Crezcamos", type: "bank", featured: false },
  { legal: "CORPORACION FINANCIERA COLOMBIANA S.A. SIGLAS CORFICOL S.A. O CORFICOLOMBIANA S.A.", display: "Corficolombiana", type: "bank", featured: false },
  { legal: "GIROS & FINANZAS COMPANIA DE FINANCIAMIENTO S.A.", display: "Giros y Finanzas", type: "bank", featured: false },
  { legal: "INVERSIONES MARIN ARGUELLO S.A.S.", display: "Marín Argüello", type: "bank", featured: false },
  { legal: "COLTEFINANCIERA S.A.", display: "Coltefinanciera", type: "bank", featured: false },
  { legal: "COOPERATIVA FINANCIERA DE ANTIOQUIA C.F.A.", display: "CFA Cooperativa de Antioquia", type: "bank", featured: false },
  { legal: "DANN REGIONAL COMPAÑIA DE FINANCIAMIENTO S.A.", display: "Dann Regional", type: "bank", featured: false },
  { legal: "TORRES CASTILLO DIANA JANETH", display: "Diana Torres", type: "bank", featured: false },
  { legal: "INVERSIONES ULLOQUE VALENCIA S.A.S.", display: "Ulloque Valencia", type: "bank", featured: false },
  { legal: "MORA JARAMILLO CESAR DE JESUS", display: "César Mora", type: "bank", featured: false },
  { legal: "COOPERATIVA MULTIACTIVA SAN PIO X DE GRANADA LTDA. COOGRANADA", display: "Coogranada", type: "bank", featured: false },
  { legal: "BANCO DE LA REPUBLICA.", display: "Banco de la República", type: "bank", featured: false },
] as const;

/**
 * Legal/canonical names only — kept for the Core-validator round-trip and any
 * consumer that still needs a flat string list (e.g. config.application.banks).
 */
export const COLOMBIAN_BANKS: readonly string[] = BANK_OPTIONS.map((b) => b.legal);

/** Well-known entities (banks + wallets) shown first in the selector. */
export const FEATURED_BANK_OPTIONS: readonly BankOption[] = BANK_OPTIONS.filter((b) => b.featured);

/** The rest — grouped under "Otros". */
export const OTHER_BANK_OPTIONS: readonly BankOption[] = BANK_OPTIONS.filter((b) => !b.featured);

/** Resolve a persisted legal name back to its display name (falls back to the name itself). */
export function displayBankName(legal: string): string {
  const match = BANK_OPTIONS.find((b) => b.legal === legal);
  return match?.display ?? legal;
}
