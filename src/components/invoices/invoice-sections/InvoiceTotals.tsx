
import { formatGNF } from "@/lib/currency";
import { numberToWords } from "@/lib/numberToWords";

interface InvoiceTotalsProps {
  subtotal: number;
  discount: number;
  total: number;
  shipping_cost?: number;
}

export function InvoiceTotals({ subtotal, discount, total, shipping_cost = 0 }: InvoiceTotalsProps) {
  return (
    <>
      <div className="border-b border-black">
        <div className="ml-auto w-2/3">
          <div className="grid grid-cols-2 border-b border-black">
            <div className="p-3 border-r border-black font-bold text-base">Montant Total</div>
            <div className="p-3 text-right font-bold text-base">{formatGNF(subtotal)}</div>
          </div>
          <div className="grid grid-cols-2 border-b border-black">
            <div className="p-3 border-r border-black font-bold text-base">Remise</div>
            <div className="p-3 text-right font-bold text-base">{formatGNF(discount)}</div>
          </div>
          {shipping_cost > 0 && (
            <div className="grid grid-cols-2 border-b border-black">
              <div className="p-3 border-r border-black font-bold text-base">Frais de transport</div>
              <div className="p-3 text-right font-bold text-base">{formatGNF(shipping_cost)}</div>
            </div>
          )}
          <div className="grid grid-cols-2 font-bold text-lg">
            <div className="p-3 border-r border-black">Net à Payer</div>
            <div className="p-3 text-right">{formatGNF(total)}</div>
          </div>
        </div>
      </div>
      
      <div className="p-2 border-b border-black text-sm">
        <p>Arrêtée la présente facture à la somme de: {numberToWords(total)} Franc Guinéen</p>
      </div>
    </>
  );
}
