import { useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Unlock } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LockScreen() {
    const { user, unlock, logout } = useAuthStore();
    const [pin, setPin] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleUnlock = async (e) => {
        e.preventDefault();
        if (pin.length !== 4) return;

        setIsLoading(true);
        setError(false);

        try {
            await api.post('/auth/verify-pin', { pin });
            unlock();
        } catch (err) {
            setError(true);
            toast.error("Invalid PIN");
            setPin("");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePinChange = (val) => {
        if (/^\d*$/.test(val) && val.length <= 4) {
            setPin(val);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-sm flex flex-col items-center gap-8 animate-in fade-in-50 zoom-in-95 duration-300">
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24 border-4 border-muted">
                        <AvatarImage src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                        <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Welcome back, {user?.name}</h2>
                        <p className="text-muted-foreground">Enter your PIN to unlock</p>
                    </div>
                </div>

                <form onSubmit={handleUnlock} className="flex flex-col gap-6 w-full px-8">
                    <div className="relative">
                        <Input 
                            type="password" 
                            className={`text-center text-3xl tracking-[1em] h-14 font-mono ${error ? "border-destructive text-destructive" : ""}`}
                            maxLength={4}
                            value={pin}
                            onChange={(e) => handlePinChange(e.target.value)}
                            autoFocus
                        />
                        {/* Placeholder dots for better visuals could go here */}
                    </div>

                    <Button 
                        size="lg" 
                        className="w-full h-12 text-lg gap-2"
                        disabled={pin.length !== 4 || isLoading}
                    >
                        {isLoading ? (
                            "Unlocking..." 
                        ) : (
                            <>
                                <Unlock className="h-5 w-5" /> Unlock
                            </>
                        )}
                    </Button>
                </form>

                <Button variant="link" className="text-muted-foreground" onClick={logout}>
                    Sign in with a different account
                </Button>
            </div>
        </div>
    );
}
