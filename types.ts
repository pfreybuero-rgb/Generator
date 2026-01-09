
export interface LineItem {
  id: string;
  name: string;
  articleNr: string;
  quantity: number;
  unitPrice: number;
  description?: string;
  notes?: string;
}

export interface ClientData {
  name: string;
  company: string;
  addressLine1: string;
  addressLine2: string;
  vatId: string;
  customerNr: string;
  deliveryAddress?: string;
}

export interface InsolvencyData {
  id: string; // Intern-ID
  proceedingNr: string;
  debtorName: string;
  debtorAddress?: string;
  court: string;
  openingDate: string;
}

export interface AppState {
  senderName: string;
  senderAddress: string;
  senderContact: {
    phone: string;
    web: string;
    email: string;
  };
  senderBank: {
    recipient: string;
    iban: string;
    bic: string;
  };
  senderLegal: {
    court: string;
    hrb: string;
    vatId: string;
    ceo: string;
    stnr: string;
    sitz: string;
  };
  client: ClientData;
  invoiceNr: string;
  date: string;
  dueDate: string;
  items: LineItem[];
  insolvency: InsolvencyData;
  taxRegion: 'de' | 'eu';
  discount: {
    value: number;
    type: 'percent' | 'fixed';
  };
  taxRate: number;
}

export const INSOLVENCY_PRESETS: InsolvencyData[] = [
  { id: 'A-2025', debtorName: 'More und Moritz Handels GmbH', debtorAddress: 'c/o Ajay Kumar Chowdhary, Senftenberger Ring 6, 13439 Berlin', court: 'Amtsgericht Charlottenburg', proceedingNr: '3616 IN 10501/25', openingDate: '01.12.2025' },
  { id: 'B-2025', debtorName: 'FRuBA Sanitär GmbH i.L.', debtorAddress: 'Reuterstraße 11, 12053 Berlin', court: 'Amtsgericht Charlottenburg', proceedingNr: '3616 IN 3216/25', openingDate: '01.12.2025' },
  { id: 'C-2025', debtorName: 'ArrowTec GmbH', debtorAddress: 'Motardstraße 35, 13629 Berlin', court: 'Amtsgericht Charlottenburg', proceedingNr: '3615 IN 10245/25', openingDate: '27.11.2025' },
  { id: 'D-2025', debtorName: 'Computer System 2000 GmbH', debtorAddress: 'ehem. Gartenfelder Straße 29-37, 13599 Berlin', court: 'Amtsgericht Charlottenburg', proceedingNr: '3609 IN 4627/25', openingDate: '26.11.2025' },
  { id: 'E-2025', debtorName: 'BG Business Group AG i.L.', debtorAddress: 'Hinterbergstraße 17, 6330 Cham, Schweiz', court: 'Amtsgericht Ravensburg', proceedingNr: '20 IN 583/24', openingDate: '05.12.2025' },
  { id: 'F-2025', debtorName: 'BSW BodySoulWork GmbH', debtorAddress: 'Riedweg 16, 89081 Ulm', court: 'Amtsgericht Ulm', proceedingNr: '1 IN 281/25', openingDate: '05.12.2025' },
  { id: 'G-2025', debtorName: 'KSB Apartments GmbH', debtorAddress: 'Casimir-Katz-Straße 15, 76593 Gernsbach', court: 'Amtsgericht Baden-Baden', proceedingNr: '11 IN 544/25', openingDate: '05.12.2025' },
  { id: 'H-2025', debtorName: 'wf-INDUSTRIEBODEN GmbH & Co. KG', debtorAddress: 'Ostener Kuften 20, 89129 Langenau', court: 'Amtsgericht Ulm', proceedingNr: '3 IN 364/25', openingDate: '05.12.2025' },
  { id: 'I-2025', debtorName: 'connectNow GmbH', debtorAddress: 'Lohnerhofstraße 2, 78467 Konstanz', court: 'Amtsgericht Konstanz', proceedingNr: 'K 42 IN 433/25', openingDate: '02.12.2025' },
  { id: 'J-2025', debtorName: 'Süd-Überdachung GmbH', debtorAddress: 'Am Sohlweg 22, 76297 Stutensee', court: 'Amtsgericht Karlsruhe', proceedingNr: '70 IN 1036/25', openingDate: '02.12.2025' },
  { id: 'K-2025', debtorName: 'Scirocco Gastronomie GmbH', debtorAddress: 'Lietzenburger Straße 93, 10719 Berlin', court: 'Amtsgericht Charlottenburg', proceedingNr: '3607 IN 10166/25', openingDate: '15.12.2025' },
  { id: 'L-2025', debtorName: 'IBS Baugesellschaft mbH', debtorAddress: 'Fürstendamm 64 a, 13465 Berlin', court: 'Amtsgericht Charlottenburg', proceedingNr: '3607 IN 6654/25', openingDate: '05.12.2025' },
  { id: 'M-2025', debtorName: 'BEAG Bauelemente- und Baugesellschaft ProjektZWEI mbH', debtorAddress: 'Oberlandstraße 26-35, 12099 Berlin', court: 'Amtsgericht Charlottenburg', proceedingNr: '3609 IN 10583/25', openingDate: '04.12.2025' },
  { id: 'N-2025', debtorName: 'Urban Rooftop Construction GmbH i.L.', debtorAddress: 'Soldiner Straße 53, 13359 Berlin', court: 'Amtsgericht Charlottenburg', proceedingNr: '3604 IN 10411/25', openingDate: '28.11.2025' },
];

export const generateRandomSuffix = () => Math.floor(10000 + Math.random() * 90000).toString();
export const getTodayStr = () => new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

const initialSuffix = generateRandomSuffix();
const initialId = `2025-${initialSuffix}`;

export const INITIAL_STATE: AppState = {
  senderName: "IMPRO Insolvenzverwertung GmbH",
  senderAddress: "Friedrichstraße 123, 10117 Berlin",
  senderContact: {
    phone: "030 23324711",
    web: "impro-insolvenz.de",
    email: "info@impro-insolvenz.de",
  },
  senderBank: {
    recipient: "Treuhandkonto IMPRO Insolvenzverwertung",
    iban: "DE82 1009 0000 1234 5678 90",
    bic: "BEVO DE BB XXX",
  },
  senderLegal: {
    court: "Amtsgericht Dresden",
    hrb: "HRB 11 904",
    vatId: "DE164313900",
    ceo: "Dr. Julian Grafrath",
    stnr: "202/111/07023",
    sitz: "Dresden",
  },
  client: {
    name: "Max Mustermann",
    company: "Musterfirma GmbH",
    addressLine1: "Musterstraße 123",
    addressLine2: "10117 Berlin",
    vatId: "DE123456789",
    customerNr: initialSuffix,
    deliveryAddress: "",
  },
  invoiceNr: initialId,
  date: getTodayStr(),
  dueDate: "Sofort",
  items: [
    {
      id: "1",
      name: "Viessmann Vitocal 250-A Luft/Wasser-Wärmepumpe, Monoblock, AWO-E-AC 251.A13 13 kW - Neu",
      articleNr: "INV-1001",
      quantity: 7,
      unitPrice: 3783,
      description: ""
    }
  ],
  insolvency: INSOLVENCY_PRESETS[0],
  taxRegion: 'de',
  discount: { value: 0, type: 'percent' },
  taxRate: 0.19,
};
