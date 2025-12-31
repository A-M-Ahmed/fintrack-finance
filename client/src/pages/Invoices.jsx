import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileText, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  
  // Payment Dialog State
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentData, setPaymentData] = useState({ walletId: '', type: 'income' });

  const [formData, setFormData] = useState({
    invoiceId: '',
    clientName: '',
    items: [{ name: '', qty: 1, price: 0 }],
    dueDate: ''
  });

  const fetchData = async () => {
    try {
      const [invRes, walletRes] = await Promise.all([
         api.get('/invoices'),
         api.get('/wallets')
      ]);
      setInvoices(invRes.data);
      setWallets(walletRes.data);
      if (walletRes.data.length > 0) {
          setPaymentData(prev => ({ ...prev, walletId: walletRes.data[0]._id }));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post('/invoices', formData);
      toast.success("Invoice created!");
      setIsOpen(false);
      setFormData({ invoiceId: '', clientName: '', items: [{ name: '', qty: 1, price: 0 }], dueDate: '' });
      fetchData();
    } catch (error) {
      toast.error("Failed to create invoice");
    }
  };

  const handleMarkPaid = async () => {
      if (!selectedInvoice) return;
      try {
          await api.put(`/invoices/${selectedInvoice._id}/status`, {
              status: 'paid',
              walletId: paymentData.walletId,
              type: paymentData.type
          });
          toast.success("Invoice marked as paid & Transaction recorded!");
          setPaymentDialog(false);
          fetchData();
      } catch (error) {
          toast.error(error.response?.data?.message || "Failed to update invoice");
      }
  };

  const openPaymentDialog = (invoice) => {
      setSelectedInvoice(invoice);
      setPaymentDialog(true);
  };

  const addItem = () => {
    setFormData(prev => ({ ...prev, items: [...prev.items, { name: '', qty: 1, price: 0 }] }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'qty' || field === 'price' ? Number(value) : value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid': return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'overdue': return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const generateInvoiceId = () => {
      // Generate a unique ID, e.g., INV-TIMESTAMP (last 6 digits)
      return `INV-${Date.now().toString().slice(-6)}`;
  };

  if (loading) return <div>Loading invoices...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <Dialog open={isOpen} onOpenChange={(val) => {
            setIsOpen(val);
            if (val) {
                setFormData(prev => ({ ...prev, invoiceId: generateInvoiceId() }));
            }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto form-grid">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Invoice ID</Label>
                  <Input value={formData.invoiceId} disabled className="bg-muted font-mono" />
                </div>
                <div className="space-y-3 flex flex-col pr-1">
                  <Label>Client Name</Label>
                  <Input value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} placeholder="Client Name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3  flex flex-col pl-1">
                  <Label>Due Date</Label>
                  <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2 px-1">
                <Label>Items</Label>
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 md:space-y-1 mt-2">
                    <Input placeholder="Item name" value={item.name} onChange={(e) => updateItem(index, 'name', e.target.value)} />
                    <Input type="number" placeholder="Qty" value={item.qty} onChange={(e) => updateItem(index, 'qty', e.target.value)} />
                    <Input type="number" placeholder="Price" value={item.price} onChange={(e) => updateItem(index, 'price', e.target.value)} />
                  </div>
                ))}
                <Button type="button" variant="outline" className="mt-2" onClick={addItem}>+ Add Item</Button>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleCreate}>Create Invoice</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No invoices yet. Create your first one!</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv._id}>
                    <TableCell className="font-medium">{inv.invoiceId}</TableCell>
                    <TableCell>{inv.clientName}</TableCell>
                    <TableCell>{format(new Date(inv.issueDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(new Date(inv.dueDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>${inv.total?.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(inv.status)}</TableCell>
                    <TableCell className="text-right">
                        {inv.status !== 'paid' && (
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 gap-1"
                                onClick={() => openPaymentDialog(inv)}
                            >
                                <CheckCircle className="h-3 w-3" /> Mark Paid
                            </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Record Payment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                       <Label>Select Wallet for Payment</Label>
                       <Select value={paymentData.walletId} onValueChange={(v) => setPaymentData({...paymentData, walletId: v})}>
                           <SelectTrigger><SelectValue placeholder="Select Wallet" /></SelectTrigger>
                           <SelectContent>
                               {wallets.map(w => <SelectItem key={w._id} value={w._id}>{w.name} (${w.currentBalance})</SelectItem>)}
                           </SelectContent>
                       </Select>
                  </div>
                  <div className="space-y-2">
                       <Label>Payment Type</Label>
                       <Select value={paymentData.type} onValueChange={(v) => setPaymentData({...paymentData, type: v})}>
                           <SelectTrigger><SelectValue /></SelectTrigger>
                           <SelectContent>
                               <SelectItem value="income">Income (Received)</SelectItem>
                               <SelectItem value="expense">Expense (Paid)</SelectItem>
                           </SelectContent>
                       </Select>
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm">Total Amount: <span className="font-bold">${selectedInvoice?.total?.toFixed(2)}</span></p>
                  </div>
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setPaymentDialog(false)}>Cancel</Button>
                  <Button onClick={handleMarkPaid}>Confirm Payment</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
