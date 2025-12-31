import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileText } from "lucide-react";
import { format } from "date-fns";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    invoiceId: '',
    clientName: '',
    items: [{ name: '', qty: 1, price: 0 }],
    dueDate: ''
  });

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/invoices');
      setInvoices(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching invoices", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post('/invoices', formData);
      toast.success("Invoice created!");
      setIsOpen(false);
      setFormData({ invoiceId: '', clientName: '', items: [{ name: '', qty: 1, price: 0 }], dueDate: '' });
      fetchInvoices();
    } catch (error) {
      toast.error("Failed to create invoice");
    }
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

  if (loading) return <div>Loading invoices...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Invoice ID</Label>
                  <Input value={formData.invoiceId} onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })} placeholder="e.g., INV-001" />
                </div>
                <div>
                  <Label>Client Name</Label>
                  <Input value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} placeholder="Client Name" />
                </div>
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
              </div>
              <div>
                <Label>Items</Label>
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 mt-2">
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
