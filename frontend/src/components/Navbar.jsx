import React from "react";
import { Button } from "./ui/button";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Link } from "react-router-dom";
import ModeToggle from "@/pages/SettingsPage";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <nav className="h-15 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-6 w-6 text-primary" />
        <Link to={"/"}>
          <span className="font-semibold text-foreground">Chat</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />

        {authUser && (
          <>
            <Button
              className="flex items-center gap-2 p-4"
              asChild
              variant="outline"
              size="sm"
            >
              <Link to="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
