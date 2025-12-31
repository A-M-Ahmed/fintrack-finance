import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CreditCard({ name, balance, number, type = "universal", className }) {
  const isUniversal = type === 'universal';
  const [showBalance, setShowBalance] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pin, setPin] = useState("");

  const handleToggleBalance = () => {
    if (showBalance) {
      setShowBalance(false);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleVerifyPin = () => {
    if (pin === "1234") {
      setShowBalance(true);
      setIsDialogOpen(false);
      setPin("");
      toast.success("Balance visible");
    } else {
      toast.error("Incorrect PIN");
    }
  };

  return (
    <>
      <div className={cn(
        "relative overflow-hidden rounded-xl p-6 text-white shadow-xl transition-transform hover:scale-[1.02]",
        isUniversal 
          ? "bg-slate-900" 
          : "bg-gradient-to-br from-gray-200 to-gray-400 text-gray-800",
        className
      )}>
        {/* Background Gradients/Effects */}
        {isUniversal && (
          <>
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-slate-800 opacity-50 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-black opacity-50 blur-3xl"></div>
          </>
        )}

        <div className="relative z-10 flex flex-col justify-between h-full min-h-[180px]">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className={cn("font-bold text-lg", isUniversal ? "text-white" : "text-gray-800")}>FinTrack.</h3>
              <p className={cn("text-xs opacity-70", isUniversal ? "text-gray-300" : "text-gray-600")}>
                  {isUniversal ? 'Universal Bank' : 'Commercial Bank'}
              </p>
            </div>
            <div className="h-8 w-12 rounded bg-white/20 backdrop-blur-sm flex items-center justify-center">
               {/* Simulating Chip */}
               <div className="h-5 w-8 rounded-sm border border-yellow-500/50 bg-yellow-500/20"></div>
            </div>
          </div>

          {/* Card Number */}
          <div className="mt-8">
              <p className={cn("font-mono text-xl tracking-widest", isUniversal ? "text-gray-200" : "text-gray-700")}>
                  {number || '**** **** **** ****'}
              </p>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end mt-6">
            <div>
              <p className={cn("text-xs opacity-70 mb-1", isUniversal ? "text-gray-400" : "text-gray-600")}>Total Balance</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {showBalance ? `$${balance?.toFixed(2)}` : '****'}
                </p>
                <button onClick={handleToggleBalance} className="focus:outline-none opacity-80 hover:opacity-100">
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end">
               {/* Visa/Mastercard Logo Simulation */}
               <div className="flex -space-x-2">
                   <div className="h-6 w-6 rounded-full bg-red-500/80"></div>
                   <div className="h-6 w-6 rounded-full bg-yellow-500/80"></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>View Balance</DialogTitle>
            <DialogDescription>Enter your security PIN to view balance. (Default: 1234)</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="space-y-2">
                <Input 
                  id="pin" 
                  type="password" 
                  placeholder="Enter PIN" 
                  className="text-center tracking-widest text-lg" 
                  maxLength={4}
                  value={pin}
                  onChange={(e) => {
                      // Allow only numbers
                      if (/^\d*$/.test(e.target.value)) {
                          setPin(e.target.value);
                      }
                  }}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter') handleVerifyPin();
                  }}
                />
             </div>
          </div>
          <DialogFooter>
            <Button onClick={handleVerifyPin} className="w-full">Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
