'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsService } from '@/services/payments.service';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/partials/Badge';
import { Button } from '@/components/partials/Button';
import { Modal } from '@/components/partials/Modal';
import { formatDate, formatCurrency } from '@/lib/utils';
import { API_URL as API } from '@/lib/config';
import type { IPayment, PaymentStatus, PaymentMethod } from '@ems/shared';
import { DollarSign, Printer, CheckCircle, FileText, Landmark, CreditCard, Receipt, ArrowRight } from 'lucide-react';

const statusVariant: Record<PaymentStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  paid: 'success',
  partial: 'warning',
  overdue: 'danger',
  pending: 'neutral',
};

export function PaymentsView() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: payments, isLoading, error, refetch } = useQuery({
    queryKey: ['payments'],
    queryFn: paymentsService.getAll,
  });

  const [activeReceipt, setActiveReceipt] = useState<IPayment | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payingBill, setPayingBill] = useState<IPayment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [pinCode, setPinCode] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mark payment paid mock mutation
  const payMutation = useMutation({
    mutationFn: async (id: string) => {
      // Direct update call mock or patch via service if exists
      // Simulate patch
      const res = await fetch(`${API}/api/payments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid', paidDate: new Date().toISOString(), method: paymentMethod }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  if (isLoading) return <Skeleton rows={6} />;
  if (error) return <ErrorMessage message={error instanceof Error ? error.message : 'Failed to load'} onRetry={() => void refetch()} />;
  
  const paymentList = payments ?? [];

  const handleOpenPay = (p: IPayment) => {
    setPayingBill(p);
    setPaymentSuccess(false);
    setPinCode('');
    setIsPayModalOpen(true);
  };

  const handleSimulatePayment = () => {
    if (!payingBill) return;
    setIsProcessingPayment(true);
    setTimeout(async () => {
      try {
        await payMutation.mutateAsync(payingBill._id);
        setIsProcessingPayment(false);
        setPaymentSuccess(true);
      } catch (err) {
        console.error(err);
        setIsProcessingPayment(false);
        alert('Payment simulation failed');
      }
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  const isTenant = user?.role === 'tenant';

  // ─── TENANT VIEW ──────────────────────────────────────────────────────────
  if (isTenant) {
    const outstanding = paymentList.filter(p => p.status === 'pending' || p.status === 'overdue');
    const totalOutstanding = outstanding.reduce((sum, p) => sum + p.amount, 0);

    return (
      <div className="space-y-6">
        {/* Balance Card */}
        <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md hover:border-[var(--color-primary)]/10 transition-all duration-300">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[var(--color-muted)]">Total Outstanding Balance</p>
            <p className="text-3xl font-bold font-[var(--font-display)] text-[var(--color-foreground)]">
              ₦{totalOutstanding.toLocaleString()}
            </p>
            <p className="text-xs text-[var(--color-muted)]">Includes all pending and overdue rent invoices</p>
          </div>
          {outstanding.length > 0 && (
            <Button
              variant="primary"
              className="px-6 py-3"
              onClick={() => handleOpenPay(outstanding[0]!)}
            >
              Pay Outstanding Rent
            </Button>
          )}
        </div>

        {/* History Table */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-[var(--font-display)] text-[var(--color-foreground)]">Payment Transactions</h3>
          <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-surface-sunken)] border-b border-[var(--color-border)]">
                <tr>
                  {['Reference No.', 'Amount', 'Due Date', 'Paid Date', 'Method', 'Status', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {paymentList.map((p) => (
                  <tr key={p._id} className="hover:bg-[var(--color-surface-sunken)]/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-[var(--color-muted)]">#{p._id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-4 font-bold text-[var(--color-foreground)]">₦{p.amount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-[var(--color-text-secondary)]">{formatDate(p.dueDate)}</td>
                    <td className="px-5 py-4 text-[var(--color-text-secondary)]">{p.paidDate ? formatDate(p.paidDate) : '—'}</td>
                    <td className="px-5 py-4 text-[var(--color-text-secondary)] capitalize">{p.method ?? '—'}</td>
                    <td className="px-5 py-4">
                      <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {p.status === 'paid' ? (
                        <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => setActiveReceipt(p)}>
                          <Receipt size={14} /> View Receipt
                        </Button>
                      ) : (
                        <Button variant="primary" size="sm" onClick={() => handleOpenPay(p)}>
                          Pay Now
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}

                {paymentList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-[var(--color-muted)] text-sm">
                      No invoices or payments registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Simulator Modal */}
        <Modal
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          title="Rent Payment Simulator"
          size="md"
        >
          {paymentSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle size={36} />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-foreground)]">Payment Successful!</h3>
              <p className="text-sm text-[var(--color-muted)] max-w-sm mx-auto">
                Your rent of ₦{payingBill?.amount.toLocaleString()} has been processed and logged in the system.
              </p>
              <div className="pt-4 border-t border-[var(--color-border)]">
                <Button variant="secondary" onClick={() => setIsPayModalOpen(false)}>
                  Close Portal
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-[var(--color-surface-sunken)] rounded-lg text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Paying For:</span>
                  <span className="font-semibold text-[var(--color-foreground)]">Rent Invoice</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Billing Amount:</span>
                  <span className="font-bold text-[var(--color-primary)]">₦{payingBill?.amount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={['p-3 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors', paymentMethod === 'bank_transfer' ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/30 text-[var(--color-primary)]' : 'border-[var(--color-border)] hover:bg-[var(--color-surface-sunken)]'].join(' ')}
                  >
                    <Landmark size={16} /> Bank Transfer
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={['p-3 rounded-lg border text-sm font-medium flex items-center gap-2 transition-colors', paymentMethod === 'card' ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/30 text-[var(--color-primary)]' : 'border-[var(--color-border)] hover:bg-[var(--color-surface-sunken)]'].join(' ')}
                  >
                    <CreditCard size={16} /> Credit/Debit Card
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold block">Enter Payment PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full px-3 py-2 text-center text-lg font-mono tracking-widest rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <Button variant="secondary" onClick={() => setIsPayModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSimulatePayment}
                  loading={isProcessingPayment}
                  disabled={pinCode.length < 4}
                >
                  Pay Now
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Receipt Modal */}
        <Modal
          isOpen={!!activeReceipt}
          onClose={() => setActiveReceipt(null)}
          title="Official Rent Receipt"
          size="md"
        >
          {activeReceipt && (
            <div className="space-y-6">
              {/* Printable Invoice Header */}
              <div className="text-center pb-6 border-b border-[var(--color-border)]">
                <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center mx-auto text-[var(--color-primary)] font-bold text-lg mb-2">
                  E
                </div>
                <h2 className="text-base font-bold font-[var(--font-display)] text-[var(--color-foreground)]">CAMPUS ESTATE MANAGEMENT</h2>
                <p className="text-xs text-[var(--color-muted)]">Official Digital Rental Invoice Receipt</p>
              </div>

              {/* Invoice Body */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-dashed border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)] font-medium">Receipt Ref:</span>
                  <span className="font-mono font-bold text-[var(--color-foreground)]">#{activeReceipt._id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)] font-medium">Date Issued:</span>
                  <span className="font-semibold text-[var(--color-foreground)]">{activeReceipt.paidDate ? formatDate(activeReceipt.paidDate) : formatDate(activeReceipt.updatedAt)}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)] font-medium">Tenant Occupant:</span>
                  <span className="font-semibold text-[var(--color-foreground)]">{user?.firstName} {user?.lastName}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-[var(--color-border)] pb-2">
                  <span className="text-[var(--color-muted)] font-medium">Payment Method:</span>
                  <span className="font-semibold text-[var(--color-foreground)] capitalize">{activeReceipt.method ?? 'Bank Transfer'}</span>
                </div>
                <div className="flex justify-between bg-[var(--color-surface-sunken)] p-3 rounded-lg border border-[var(--color-border)] mt-4">
                  <span className="font-bold text-[var(--color-foreground)]">Rent Paid Amount:</span>
                  <span className="font-bold text-[var(--color-primary)] text-lg">₦{activeReceipt.amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Digital Seal stamp */}
              <div className="flex flex-col items-center justify-center py-4">
                <div className="border-4 border-emerald-600/30 text-emerald-600 rounded-full px-4 py-2 text-xs uppercase font-extrabold tracking-widest rotate-[-6deg] animate-[pulse_3s_infinite]">
                  ✓ PAID IN FULL
                </div>
                <span className="text-[10px] text-[var(--color-muted)] mt-2">Verified by EMS Central Treasury</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <Button variant="secondary" onClick={() => setActiveReceipt(null)}>
                  Close
                </Button>
                <Button variant="primary" className="gap-2" onClick={handlePrint}>
                  <Printer size={16} /> Print Receipt
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    );
  }

  // ─── ADMIN & LANDLORD VIEW ────────────────────────────────────────────────
  const totalCollected = paymentList.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = paymentList.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-5 hover:shadow-md hover:border-[var(--color-primary)]/10 transition-all duration-300">
          <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">Total Rent Collected</p>
          <p className="text-2xl font-bold text-emerald-600">₦{totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] p-5 hover:shadow-md hover:border-[var(--color-primary)]/10 transition-all duration-300">
          <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">Pending Invoices Amount</p>
          <p className="text-2xl font-bold text-amber-600">₦{totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* Global Invoices Table */}
      <div className="space-y-4">
        <h3 className="text-base font-bold font-[var(--font-display)] text-[var(--color-foreground)]">Billing & Rent Invoices</h3>
        <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-sunken)] border-b border-[var(--color-border)]">
              <tr>
                {['Reference No.', 'Amount', 'Due Date', 'Paid Date', 'Method', 'Status', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {paymentList.map((p) => (
                <tr key={p._id} className="hover:bg-[var(--color-surface-sunken)]/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-[var(--color-muted)]">#{p._id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-4 font-bold text-[var(--color-foreground)]">₦{p.amount.toLocaleString()}</td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)]">{formatDate(p.dueDate)}</td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)]">{p.paidDate ? formatDate(p.paidDate) : '—'}</td>
                  <td className="px-5 py-4 text-[var(--color-text-secondary)] capitalize">{p.method ?? '—'}</td>
                  <td className="px-5 py-4">
                    <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {p.status !== 'paid' && (
                      <Button
                        variant="primary"
                        size="sm"
                        loading={payMutation.isPending && payingBill?._id === p._id}
                        onClick={async () => {
                          setPayingBill(p);
                          setPaymentMethod('bank_transfer');
                          try {
                            await payMutation.mutateAsync(p._id);
                            alert('Payment logged successfully');
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      >
                        Mark Received
                      </Button>
                    )}
                  </td>
                </tr>
              ))}

              {paymentList.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[var(--color-muted)] text-sm">
                    No transactions registered on this platform.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
