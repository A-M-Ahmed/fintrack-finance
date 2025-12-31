import { useState, useRef } from "react";
import useAuthStore from "@/store/useAuthStore";
import api from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Camera, Upload } from "lucide-react";

export default function Settings() {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [file, setFile] = useState(null);

  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const handleFileChange = (e) => {
      const selected = e.target.files[0];
      if (selected) {
          if (!selected.type.startsWith('image/')) {
              toast.error("Please select an image file");
              return;
          }
          if (selected.size > 5 * 1024 * 1024) {
              toast.error("Image size too large (max 5MB)");
              return;
          }
          setFile(selected);
      }
  };

  const handleUpdateProfile = async () => {
    setLoadingProfile(true);
    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('email', profileData.email);
      if (file) {
          formData.append('avatar', file);
      }

      const res = await api.put('/auth/updatedetails', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      updateUser(res.data);
      toast.success("Profile updated successfully");
      setFile(null); // Reset file input
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (passData.newPassword !== passData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoadingPass(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword
      });
      toast.success("Password updated successfully!");
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update password";
      toast.error(msg);
    } finally {
      setLoadingPass(false);
    }
  };

  // Helper to resolve avatar URL
  const getAvatarUrl = () => {
      if (file) return URL.createObjectURL(file);
      if (user?.avatar) {
          return user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`;
      }
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`;
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl px-1">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div 
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current.click()}
            >
                <Avatar className="h-24 w-24 border-2 border-muted">
                    <AvatarImage src={getAvatarUrl()} className="object-cover" />
                    <AvatarFallback className="text-2xl">{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white h-8 w-8" />
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*" 
                />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-lg">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Button variant="outline" size="sm" className="h-8 gap-2 mt-2" onClick={() => fileInputRef.current.click()}>
                  <Upload className="h-3 w-3" /> Change Picture
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={profileData.name} 
                onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={profileData.email} 
                onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
              />
            </div>
            <Button onClick={handleUpdateProfile} disabled={loadingProfile}>
               {loadingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Change your password (3 days cooldown)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input 
              id="current-password" 
              type="password" 
              value={passData.currentPassword}
              onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input 
              id="new-password" 
              type="password" 
              value={passData.newPassword}
              onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              value={passData.confirmPassword}
              onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
            />
          </div>
          <Button onClick={handleChangePassword} disabled={loadingPass} variant="secondary">
            {loadingPass && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
