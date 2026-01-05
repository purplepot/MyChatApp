import { User, Mail, Camera } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

export default function Profile() {
  const [selectedImg, setSelectedImg] = useState(null);
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="h-[calc(100vh-15rem)] mt-15 flex items-center  justify-center p-4 ">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">Profile</h1>
            <p className="text-muted-foreground">Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Profile Fields */}
          <div className="space-y-5 mt-6">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <User className="h-4 w-4" />
                Full Name
              </label>
              <div className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground">
                {authUser.fullName}
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <div className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground">
                {authUser.email}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-8 pt-6 border-t border-border">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Account Information
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Member Since</span>
                <span className="text-foreground">January 2024</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Account Status</span>
                <span className="text-online font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
