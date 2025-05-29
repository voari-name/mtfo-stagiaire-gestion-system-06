
import React from "react";
import { NotificationBar } from "./NotificationBar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
  username?: string;
}

export const Header = ({ title, username = "" }: HeaderProps) => {
  // Get initials from username if provided
  const initials = username
    ? username
        .split(' ')
        .map(name => name[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : "";

  return (
    <header className="bg-white shadow-sm z-10 animate-fade-in">
      <div className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-4">
          <NotificationBar />
          {username && (
            <>
              <span className="text-sm text-gray-600 hidden md:block">Bienvenue, {username}</span>
              <Avatar className="h-10 w-10 hover-scale transition-all duration-300">
                <AvatarImage 
                  src="/lovable-uploads/52778f7b-9712-4ba5-91b9-65eeb655d7b5.png" 
                  alt={username}
                  className="object-cover"
                />
                <AvatarFallback className="bg-blue-800 text-white text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
