
import React from 'react';
import { AppState, LineItem } from '../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
};

// --- Shared Components ---

const LogoShield: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 115" className={className} preserveAspectRatio="xMidYMax meet">
    <path 
      d="M50 5 L90 20 V50 C90 75 50 95 50 95 C50 95 10 75 10 50 V20 L50 5 Z" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="6"
    />
    <path 
      d="M35 50 L45 60 L65 40" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const DocumentHeader: React.FC<{ data: AppState; hideTitle?: boolean }> = ({ data, hideTitle }) => (
  <div className="flex justify-between items-start mb-8">
    <div className="flex items-center">
      <div className="w-14 h-14 mr-4 flex items-center justify-center text-brand-gold">
        <LogoShield className="w-10 h-10" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none uppercase">
          IMPRO
        </h1>
        <p className="text-slate-500 font-medium text-[12px] mt-1 tracking-wide">
          Insolvenzverwertung GmbH
        </p>
      </div>
    </div>
    {!hideTitle && (
      <div className="text-right">
        <h2 className="text-4xl font-bold text-slate-800 tracking-tighter">RECHNUNG</h2>
      </div>
    )}
  </div>
);

const DocumentFooter: React.FC<{ data: AppState }> = ({ data }) => (
  <div className="mt-auto pt-6 border-t border-slate-200 text-[9px] text-slate-500">
    <div className="grid grid-cols-[1.2fr_1fr_1.2fr_0.5fr] gap-8">
      <div>
        <h4 className="font-bold text-slate-700 mb-1">{data.senderName}</h4>
        <p>{data.senderAddress.split(',')[0]}</p>
        <p>{data.senderAddress.split(',')[1].trim()}</p>
        <p>Deutschland</p>
      </div>
      <div>
        <h4 className="font-bold text-slate-700 mb-1">Kontakt</h4>
        <p>Tel: {data.senderContact.phone}</p>
        <p>Web: {data.senderContact.web}</p>
        <p>E-Mail: {data.senderContact.email}</p>
      </div>
      <div>
        <h4 className="font-bold text-slate-700 mb-1">Firmengericht</h4>
        <p>{data.senderLegal.court}</p>
        <p>{data.senderLegal.hrb}</p>
        <p>USt-IdNr.: {data.senderLegal.vatId}</p>
      </div>
      <div className="flex flex-col items-end justify-center">
        <div className="w-10 h-10 text-brand-gold p-1 flex items-center justify-center">
          <LogoShield className="w-full h-full" />
        </div>
        <span className="text-[7px] font-bold mt-1 text-brand-gold tracking-widest uppercase">IMPRO</span>
      </div>
    </div>
  </div>
);

const AddressBlock: React.FC<{ data: AppState }> = ({ data }) => (
  <div className="mb-10">
    <p className="text-[9px] text-slate-400 mb-3 border-b border-slate-100 pb-1 w-fit">
      {data.senderName} • {data.senderAddress}
    </p>
    <div className="text-[13px] leading-snug text-slate-800">
      <p className="font-medium">{data.client.name}</p>
      {data.client.company && <p>{data.client.company}</p>}
      <p>{data.client.addressLine1}</p>
      <p>{data.client.addressLine2}</p>
      {data.client.vatId && (
        <p className="mt-1">USt-IdNr.: {data.client.vatId}</p>
      )}
    </div>
  </div>
);

const TotalsAndLegalText: React.FC<{ data: AppState }> = ({ data }) => {
  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * (data.taxRegion === 'eu' ? 0 : data.taxRate);
  const total = subtotal + tax;

  return (
    <div className="flex justify-between items-start gap-10 mt-2">
      <div className="w-[55%] text-[10px] leading-relaxed text-slate-700 space-y-3">
        <div className="space-y-0.5">
          <p>Lieferdatum: entspricht Rechnungsdatum</p>
          <p>Zahlungsziel: Zahlung per Treuhandkonto – sofort fällig</p>
          <p>Leistungsart: {data.taxRegion === 'de' ? 'Inländische Lieferung' : 'Innergemeinschaftliche Lieferung (steuerfrei)'}</p>
        </div>
        
        <div className="space-y-0.5">
          <p>Der Verkauf erfolgt im Rahmen des Insolvenzverfahrens gemäß § 159 InsO.</p>
          <p>Die gelieferten Waren bleiben bis zur vollständigen Bezahlung gemäß § 449 BGB Eigentum der Insolvenzmasse.</p>
          <p>Ein Rückgaberecht von 14 Tagen ab Erhalt der Ware wird eingeräumt.</p>
        </div>

        <div className="pt-1">
          <p className="font-medium mb-1">Bitte überweisen Sie den Rechnungsbetrag auf das Treuhandkonto des Gläubigers gemäß § 80 Abs. 1 InsO.</p>
          <p>Empfänger: {data.senderBank.recipient}</p>
          <p>IBAN: {data.senderBank.iban}</p>
          <p>BIC: {data.senderBank.bic}</p>
          <p>Bearbeitet von: {data.senderLegal.ceo}</p>
        </div>
      </div>

      <div className="w-[40%]">
        <div className="bg-[#f8f9fa] p-4 rounded-sm space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">Zwischensumme (netto)</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">Umsatzsteuer ({data.taxRegion === 'eu' ? '0%' : '19%'})</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-slate-200">
            <span className="text-[14px] font-bold text-slate-800">Gesamtbetrag</span>
            <span className="text-[14px] font-bold text-slate-800">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Templates ---

interface PageData {
  items: LineItem[];
  hasTotals: boolean;
  isFirst: boolean;
  isLast: boolean;
  pageNumber: number;
}

const InvoicePage: React.FC<{ data: AppState; pageData: PageData; totalPages: number }> = ({ data, pageData, totalPages }) => (
  <div className="document-page bg-white p-[20mm] w-[210mm] h-[297mm] mx-auto shadow-lg relative flex flex-col box-border font-sans text-slate-800 mb-8 overflow-hidden">
    <DocumentHeader data={data} />
    
    <div className="flex-1 flex flex-col">
      {pageData.isFirst && (
        <div className="flex justify-between items-start mb-6">
          <div className="w-[60%]">
            <AddressBlock data={data} />
          </div>
          <div className="w-[30%] text-[11px] space-y-1.5 pt-8">
            <div className="grid grid-cols-[1.2fr_1fr] gap-x-4">
              <span className="font-bold text-slate-700">Rechnungs-Nr.:</span>
              <span className="text-right text-slate-600">{data.invoiceNr}</span>
              <span className="font-bold text-slate-700">Datum:</span>
              <span className="text-right text-slate-600">{data.date}</span>
              <span className="font-bold text-slate-700">Kundennummer:</span>
              <span className="text-right text-slate-600">KD-{data.client.customerNr}</span>
              <span className="font-bold text-slate-700">Fälligkeit:</span>
              <span className="text-right text-slate-600">Sofort</span>
            </div>
          </div>
        </div>
      )}

      {pageData.items.length > 0 && (
        <div className="w-full mb-6 border border-slate-100">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-slate-200">
                <th className="py-3 px-4 text-left font-bold text-slate-700 w-[55%]">Produkt & Beschreibung</th>
                <th className="py-3 px-4 text-right font-bold text-slate-700">Einzelpreis (€)</th>
                <th className="py-3 px-4 text-center font-bold text-slate-700">Menge</th>
                <th className="py-3 px-4 text-right font-bold text-slate-700">Gesamtpreis (€)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageData.items.map(item => (
                <tr key={item.id}>
                  <td className="py-4 px-4 align-top">
                    <p className="font-medium text-slate-800">{item.name}</p>
                    {item.description && <p className="text-[9px] text-slate-500 mt-1 whitespace-pre-wrap">{item.description}</p>}
                    <p className="text-[9px] text-slate-400 mt-1">Art.-Nr: {item.articleNr}</p>
                  </td>
                  <td className="py-4 px-4 text-right align-top tabular-nums text-slate-600">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-4 px-4 text-center align-top tabular-nums text-slate-600">{item.quantity}</td>
                  <td className="py-4 px-4 text-right align-top font-medium tabular-nums text-slate-800">{formatCurrency(item.unitPrice * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageData.hasTotals && <TotalsAndLegalText data={data} />}
    </div>

    <DocumentFooter data={data} />
  </div>
);

export const InvoiceTemplate: React.FC<{ data: AppState }> = ({ data }) => {
  const itemsPerPage = 8; 
  const pages: LineItem[][] = [];
  
  if (data.items.length === 0) {
    pages.push([]);
  } else {
    for (let i = 0; i < data.items.length; i += itemsPerPage) {
      pages.push(data.items.slice(i, i + itemsPerPage));
    }
  }
  
  const totalPages = pages.length;

  return (
    <>
      {pages.map((pageItems, idx) => (
        <InvoicePage 
          key={idx}
          data={data}
          pageData={{
            items: pageItems,
            hasTotals: idx === totalPages - 1,
            isFirst: idx === 0,
            isLast: idx === totalPages - 1,
            pageNumber: idx + 1
          }}
          totalPages={totalPages}
        />
      ))}
    </>
  );
};

export const ConfirmationTemplate: React.FC<{ data: AppState }> = ({ data }) => (
  <div className="document-page bg-white p-[20mm] w-[210mm] min-h-[297mm] mx-auto shadow-lg relative flex flex-col font-sans text-slate-800 mb-8 overflow-hidden">
    <DocumentHeader data={data} hideTitle={true} />
    
    <div className="flex justify-between items-start mb-8">
      <div className="w-[60%]">
        <AddressBlock data={data} />
      </div>
      <div className="w-[35%] text-[11px] pt-6 text-right space-y-1">
        <p><span className="font-bold">Aktenzeichen:</span> {data.insolvency.proceedingNr}</p>
        <p><span className="font-bold">Belegdatum:</span> {data.date}</p>
        <p><span className="font-bold">Sachbearbeiter:</span> {data.senderLegal.ceo}</p>
      </div>
    </div>

    <div className="mt-4 flex-1">
      <h2 className="text-[18px] font-bold uppercase mb-6 border-b border-slate-200 pb-2 text-slate-800">B2B-BESTÄTIGUNG: HERKUNFT & RECHTSMÄSSIGE VERWERTUNG</h2>
      
      <div className="bg-[#f8f9fa] p-5 rounded-sm mb-8 text-[11px] grid grid-cols-[140px_1fr] gap-y-2 gap-x-4">
        <span className="font-bold text-slate-500 uppercase tracking-tighter">Insolvenzverfahren:</span>
        <span className="font-medium text-slate-800">{data.insolvency.proceedingNr}</span>
        <span className="font-bold text-slate-500 uppercase tracking-tighter">Schuldnerin:</span>
        <span className="font-medium text-slate-800">{data.insolvency.debtorName}</span>
        <span className="font-bold text-slate-500 uppercase tracking-tighter">Insolvenzgericht:</span>
        <span className="font-medium text-slate-800">{data.insolvency.court} (Eröffnung: {data.insolvency.openingDate})</span>
        <span className="font-bold text-slate-500 uppercase tracking-tighter">Verwertungsstelle:</span>
        <span className="font-bold text-slate-800">{data.senderName}</span>
      </div>

      <div className="text-[12px] space-y-6 leading-relaxed text-slate-700">
        <p>Sehr geehrte Damen und Herren,</p>
        <p>hiermit bestätigen wir Ihnen die ordnungsgemäße und rechtlich zulässige Verwertung der von Ihnen erworbenen Gegenstände aus dem Insolvenzverfahren <b>{data.insolvency.debtorName}</b> ({data.insolvency.proceedingNr}).</p>
        
        <div className="pt-2">
          <p className="font-bold text-slate-800 mb-3">Zusicherung der Herkunft & Masseberechtigung</p>
          <ul className="space-y-3 pl-1">
            <li className="flex items-start gap-3 italic">
              <span className="w-1.5 h-1.5 bg-brand-gold mt-1.5 rounded-full shrink-0" />
              Die Ware stammt nachweislich aus dem verwertbaren Bestand der vorgenannten Schuldnerin.
            </li>
            <li className="flex items-start gap-3 italic">
              <span className="w-1.5 h-1.5 bg-brand-gold mt-1.5 rounded-full shrink-0" />
              Sämtliche Gegenstände sind zum Zeitpunkt der Verwertung frei von Rechten Dritter.
            </li>
            <li className="flex items-start gap-3 italic">
              <span className="w-1.5 h-1.5 bg-brand-gold mt-1.5 rounded-full shrink-0" />
              Der gewerbliche Weiterverkauf durch den Erwerber ist rechtlich uneingeschränkt zulässig.
            </li>
          </ul>
        </div>

        <p className="pt-6 text-slate-400 text-[10px]">Überprüfungsmöglichkeit der Verfahrensdaten über: <i>insolvenzbekanntmachungen.de</i></p>
        
        <div className="mt-12">
           <p className="font-medium text-slate-500 mb-8">Mit freundlichen Grüßen</p>
           <div className="w-64">
             <p className="text-[13px] font-medium text-slate-800">{data.senderLegal.ceo}</p>
             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Insolvenzsachbearbeiter</p>
           </div>
        </div>
      </div>
    </div>
    <DocumentFooter data={data} />
  </div>
);

InvoiceTemplate.displayName = 'InvoiceTemplate';
ConfirmationTemplate.displayName = 'ConfirmationTemplate';
