
import { Card } from "@/components/ui/card";
import { InvoiceForm } from "./InvoiceForm";
import { useInvoiceForm } from "@/hooks/use-invoice-form";
import { DynamicInvoice } from "./dynamic/DynamicInvoice";
import { useState } from "react";
import { InvoicePaymentDialog } from "./payments/InvoicePaymentDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const InvoiceFormWrapper = ({ onClose }: { onClose: () => void }) => {
  const {
    formData,
    selectedProducts,
    handleInputChange,
    handleAddProduct,
    handleRemoveProduct,
    handleUpdateQuantity,
    handleUpdateDiscount,
    handleSubmitInvoice,
  } = useInvoiceForm();

  const [showPreview, setShowPreview] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);

  const { data: invoice, refetch: refetchInvoice } = useQuery({
    queryKey: ['invoice', currentInvoiceId],
    queryFn: async () => {
      if (!currentInvoiceId) return null;
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', currentInvoiceId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!currentInvoiceId
  });

  // Calcul du sous-total des produits
  const subtotal = selectedProducts.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);

  // Calcul de la remise totale
  const totalDiscount = selectedProducts.reduce((total, product) => {
    return total + (product.discount || 0);
  }, 0);

  // Calcul du total final
  const finalTotal = subtotal - totalDiscount;

  const handlePreviewToggle = () => {
    setShowPreview(!showPreview);
  };

  const handleAddPayment = () => {
    setShowPaymentDialog(true);
  };

  const handlePaymentComplete = () => {
    refetchInvoice();
  };

  const handleSubmit = async () => {
    const newInvoice = await handleSubmitInvoice();
    if (newInvoice?.id) {
      setCurrentInvoiceId(newInvoice.id);
      setShowPreview(true);
    }
  };

  // Ensure payment_status is one of the allowed values
  const paymentStatus = invoice?.payment_status as 'paid' | 'partial' | 'pending' || 'pending';

  return (
    <div className="space-y-6">
      <Card className="enhanced-glass p-8 rounded-xl space-y-6 animate-fade-in">
        <InvoiceForm
          formData={formData}
          onClose={onClose}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          selectedProducts={selectedProducts}
          onAddProduct={handleAddProduct}
          onRemoveProduct={handleRemoveProduct}
          onUpdateQuantity={handleUpdateQuantity}
          onUpdateDiscount={handleUpdateDiscount}
          onPreviewToggle={handlePreviewToggle}
        />
      </Card>

      {showPreview && (
        <DynamicInvoice
          invoiceNumber={formData.invoiceNumber}
          items={selectedProducts}
          date={new Date().toLocaleDateString()}
          subtotal={subtotal}
          discount={totalDiscount}
          total={finalTotal}
          onDownload={() => setShowPreview(false)}
          paymentStatus={paymentStatus}
          paidAmount={invoice?.paid_amount}
          remainingAmount={invoice?.remaining_amount}
          onAddPayment={handleAddPayment}
          clientName={formData.clientName}
        />
      )}

      {showPaymentDialog && currentInvoiceId && (
        <InvoicePaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          invoiceId={currentInvoiceId}
          remainingAmount={invoice?.remaining_amount || 0}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};
