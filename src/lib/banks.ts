// Source: src/data/banks-colombia.csv (Superfinanciera, 2026-09-08 + wallets)
//
// NOMBRE is the legal/canonical name — the value that must survive a round-trip to
// Core's `COLOMBIAN_BANKS` validator (shared/constants/colombian_banks.py), so it is
// kept byte-identical to that list. DISPLAY_NAME is the short user-facing name shown in
// the selector; TYPE is "bank" (vigilado por Superfinanciera) or "wallet"
// (Nequi/Daviplata — plataformas de pago, no bancos vigilados).

export type BankType = "bank" | "wallet";

export interface BankOption {
  /** Legal/canonical name — persisted to bank_entity and validated by Core. */
  legal: string;
  /** Short name shown to the user in the selector. */
  display: string;
  type: BankType;
}

export const BANK_OPTIONS: readonly BankOption[] = [
  { legal: "MONTES DE BOLIVAR NELLY MARIA", display: "Montes de Bolívar", type: "bank" },
  { legal: "LIDER FINANZAS DE LA COSTA S.A.S", display: "Líder Finanzas", type: "bank" },
  { legal: "INVERSIONES G.R.G. S.A.S.", display: "G.R.G. Inversiones", type: "bank" },
  { legal: "JIMENEZ GALEANO BELSY PATRICIA", display: "Belsy Jiménez", type: "bank" },
  { legal: "CLINICREDITO.COM S.A.S.", display: "Clinicrédito", type: "bank" },
  { legal: "COOFINANCIERA SOLUCIONES S.A.S.", display: "Coofinanciera Soluciones", type: "bank" },
  { legal: "CVP ASESORIAS Y SERVICIOS S.A.S.", display: "CVP Asesorías", type: "bank" },
  { legal: "BANCO SERFINANZA S.A", display: "Banco Serfinanza", type: "bank" },
  { legal: "SERGIO RAMIREZ GARCIA COMUNICACIONES S. EN C.", display: "Comunicaciones Sergio Ramírez", type: "bank" },
  { legal: "CREDIAPP S.A.S.", display: "Crediapp", type: "bank" },
  { legal: "COOPERATIVA DE TAXI SIGLA COODETAX", display: "Coodetax", type: "bank" },
  { legal: "ROHENES RAMIREZ FELIPE SANTIAGO", display: "Felipe Rohenes", type: "bank" },
  { legal: "AB BUSINESS CAPITAL SAS", display: "AB Business Capital", type: "bank" },
  { legal: "HOLDING MASTER GROUP S.A.S.", display: "Holding Master Group", type: "bank" },
  { legal: "CENTRAL DE CREDITOS DEL CARIBE S.A.S. SIGLA CENCREDI S.A.S.", display: "Cencredi", type: "bank" },
  { legal: "LABOR DE LIBRANZA S.A.S.", display: "Labor de Libranza", type: "bank" },
  { legal: "COOPERATIVA DE LA INDUSTRIA ASEGURADORA COOPSEGUROS", display: "Coopseguros", type: "bank" },
  { legal: "PRESTYC S.A.S.", display: "Prestyc", type: "bank" },
  { legal: "COOPERATIVA MULTIACTIVA COONALFE-SIGLA COONALFE", display: "Coonalfe", type: "bank" },
  { legal: "CONSULTORIAS SERVICIOS Y TELECOMUNICACIONES S.A.S.", display: "Consercom", type: "bank" },
  { legal: "B.S.S. & CIA. S. EN C.", display: "B.S.S.", type: "bank" },
  { legal: "FONVALORES S. EN C. S.", display: "Fonvalores", type: "bank" },
  { legal: "FINANCIAL COUNSEL S.A.S.", display: "Financial Counsel", type: "bank" },
  { legal: "BANCO COOPERATIVO COOPCENTRAL SIGLA COOPCENTRAL", display: "Coopcentral", type: "bank" },
  { legal: "BANCO CAJA SOCIAL", display: "Banco Caja Social", type: "bank" },
  { legal: "COOPERATIVA MULTIACTIVA DE LA AVIACION CIVIL COLOMBIANA CUYA SIGLA ES COOPEDAC", display: "Coopedac", type: "bank" },
  { legal: "BANCO COMPARTIR S.A.", display: "Banco Compartir", type: "bank" },
  { legal: "BANCO POPULAR S. A.", display: "Banco Popular", type: "bank" },
  { legal: "BANCO DE BOGOTA.", display: "Banco de Bogotá", type: "bank" },
  { legal: "BANCO CREDIFINANCIERA S.A", display: "Credifinanciera", type: "bank" },
  { legal: "BANCO GNB SUDAMERIS S.A. PUDIENDO UTILIZAR EL NOMBRE DE BANCOGNB SUDAMERIS O SUDAMERIS", display: "GNB Sudameris", type: "bank" },
  { legal: "CREDIFAMILIA COMPAÑIA DE FINANCIAMIENTO S.A.", display: "Credifamilia", type: "bank" },
  { legal: "BANCO COMERCIAL AV VILLAS S.A. y/o BANCO DE AHORRO Y VIVIENDA AVVILLAS BANCO AV VILLAS O AV VILLAS", display: "AV Villas", type: "bank" },
  { legal: "BANCO FALABELLA S A", display: "Banco Falabella", type: "bank" },
  { legal: "FINANCIERA ANDINA S.A. FINANDINA COMPANIA DE FINANCIAMIENTOCOMERCIAL PODRA IGUALMENTE DENOMINARSE EN TODOS SUS ACTOS FINANCIERAANDINA S.A. O POR SU SIGLA FINANDINA", display: "Finandina", type: "bank" },
  { legal: "SCOTIABANK COLPATRIA S.A Y PODRA UTILIZAR CUALQUIERA DE LOSSIGUIENTES NOMBRES ABREVIADOS O SIGLAS BANCO COLPATRIA, SCOTIABANK,SCOTIABANK COLPATRIA, COLPATRIA SCOTIABANK, COLPATRIA MULTIBANCA,MULTIBANC", display: "Scotiabank Colpatria", type: "bank" },
  { legal: "BANCO DAVIVIENDA S.A.", display: "Davivienda", type: "bank" },
  { legal: "BANCO AGRARIO DE COLOMBIA S.A. Y PODRA USAR EL NOMBRE BANAGRARIO", display: "Banco Agrario", type: "bank" },
  { legal: "BANCO DE LAS MICROFINANZAS BANCAMIA S.A.", display: "Bancamía", type: "bank" },
  { legal: "BANCO BILBAO VIZCAYA ARGENTARIA COLOMBIA S.A. BBVA COLOMBIA", display: "BBVA", type: "bank" },
  { legal: "CREZCAMOS S.A. COMPAÑIA DE FINANCIAMIENTO", display: "Crezcamos", type: "bank" },
  { legal: "BANCO PICHINCHA S.A.", display: "Banco Pichincha", type: "bank" },
  { legal: "BANCO W S.A.", display: "Banco W", type: "bank" },
  { legal: "CORPORACION FINANCIERA COLOMBIANA S.A. SIGLAS CORFICOL S.A. O CORFICOLOMBIANA S.A.", display: "Corficolombiana", type: "bank" },
  { legal: "GIROS & FINANZAS COMPANIA DE FINANCIAMIENTO S.A.", display: "Giros y Finanzas", type: "bank" },
  { legal: "BANCO DE OCCIDENTE S. A.", display: "Banco de Occidente", type: "bank" },
  { legal: "INVERSIONES MARIN ARGUELLO S.A.S.", display: "Marín Argüello", type: "bank" },
  { legal: "COLTEFINANCIERA S.A.", display: "Coltefinanciera", type: "bank" },
  { legal: "COOPERATIVA FINANCIERA DE ANTIOQUIA C.F.A.", display: "CFA Cooperativa de Antioquia", type: "bank" },
  { legal: "DANN REGIONAL COMPAÑIA DE FINANCIAMIENTO S.A.", display: "Dann Regional", type: "bank" },
  { legal: "BANCOLOMBIA S.A. y/o BANCO DE COLOMBIA S.A.", display: "Bancolombia", type: "bank" },
  { legal: "ITAU CORPBANCA COLOMBIA S.A.", display: "Itaú", type: "bank" },
  { legal: "TORRES CASTILLO DIANA JANETH", display: "Diana Torres", type: "bank" },
  { legal: "BANCO MUNDO MUJER S.A.", display: "Banco Mundo Mujer", type: "bank" },
  { legal: "INVERSIONES ULLOQUE VALENCIA S.A.S.", display: "Ulloque Valencia", type: "bank" },
  { legal: "MORA JARAMILLO CESAR DE JESUS", display: "César Mora", type: "bank" },
  { legal: "COOPERATIVA MULTIACTIVA SAN PIO X DE GRANADA LTDA. COOGRANADA", display: "Coogranada", type: "bank" },
  { legal: "BANCO DE LA REPUBLICA.", display: "Banco de la República", type: "bank" },
  { legal: "NEQUI S.A. COMPAÑIA DE FINANCIAMIENTO", display: "Nequi", type: "wallet" },
  { legal: "DAVIPLATA S.A.S.", display: "Daviplata", type: "wallet" },
] as const;

/**
 * Legal/canonical names only — kept for the Core-validator round-trip and any
 * consumer that still needs a flat string list (e.g. config.application.banks).
 */
export const COLOMBIAN_BANKS: readonly string[] = BANK_OPTIONS.map((b) => b.legal);

/** Resolve a persisted legal name back to its display name (falls back to the name itself). */
export function displayBankName(legal: string): string {
  const match = BANK_OPTIONS.find((b) => b.legal === legal);
  return match?.display ?? legal;
}
