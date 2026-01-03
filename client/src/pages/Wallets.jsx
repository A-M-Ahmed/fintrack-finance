import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, PlusCircle, Landmark, Smartphone, Banknote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallets, useWalletMutations } from "@/hooks/useWallets";

// Wallets Skeleton
const WalletsSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default function Wallets() {
  const { data: wallets = [], isLoading } = useWallets();
  const { createWallet } = useWalletMutations();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'bank', initialBalance: '' });

  const handleCreate = () => {
    if (!formData.name) return toast.error("Name is required");

    const payload = {
        ...formData,
        initialBalance: Number(formData.initialBalance || 0)
    };

    createWallet.mutate(payload, {
        onSuccess: () => {
            setIsOpen(false);
            setFormData({ name: '', type: 'bank', initialBalance: '' });
        }
    });
  };

  const getWalletIcon = (type) => {
    switch (type) {
      case 'bank': return <Landmark className="h-6 w-6" />;
      case 'mobile': return <Smartphone className="h-6 w-6" />;
      case 'cash': return <Banknote className="h-6 w-6" />;
      default: return <Wallet className="h-6 w-6" />;
    }
  };

  if (isLoading) return <WalletsSkeleton />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">My Wallets</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> Add Wallet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Wallet</DialogTitle>
            </DialogHeader>
            <div className="dialog-grid">
              <div className="form-group">
                <Label htmlFor="name">Wallet Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="e.g., Universal Bank"
                />
              </div>
              <div className="form-group">
                <Label>Wallet Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="mobile">Mobile Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="form-group">
                <Label htmlFor="balance">Initial Balance</Label>
                <Input 
                  id="balance" 
                  type="text" 
                  value={formData.initialBalance} 
                  onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) setFormData({ ...formData, initialBalance: val });
                  }}
                  placeholder="0"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreate} disabled={createWallet.isPending}>
                {createWallet.isPending ? 'Creating...' : 'Create Wallet'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {wallets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No wallets yet. Create your first one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet) => (
            <Card key={wallet._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{wallet.name}</CardTitle>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {getWalletIcon(wallet.type)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${wallet.currentBalance?.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground capitalize">{wallet.type} Account</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
