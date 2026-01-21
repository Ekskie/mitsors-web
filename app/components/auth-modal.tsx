'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { AuthForm } from './auth-form';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // B-3: Helper to show the user we are syncing their specific progress
  const getWizardRegion = () => {
    if (typeof window === 'undefined') return 'your progress';
    const data = JSON.parse(localStorage.getItem('mitsors-wizard-data') || '{}');
    return data.region || 'your progress';
  };

  return (
    <Dialog open={isOpen} onOpenChange={isAuthenticating ? undefined : onClose}>
      <DialogContent className="sm:max-w-[420px] p-8 bg-[#0B0E14] text-white border-none shadow-2xl">
        
        {/* B-1: UX - Full-screen loading overlay (z-50) */}
        {isAuthenticating && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            <p className="mt-4 text-sm font-medium text-emerald-500">Securing Session...</p>
          </div>
        )}

        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold tracking-tight">Save Your Progress</DialogTitle>
          <DialogDescription className="text-gray-400 mt-2">
            Sync your data from <b>{getWizardRegion()}</b> to the cloud to access it from any device.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <AuthForm 
            setGlobalLoading={setIsAuthenticating} 
            onClose={onClose} 
          />
        </div>

        <div className="mt-6 flex justify-center border-t border-gray-800 pt-6">
          <button 
            onClick={onClose}
            disabled={isAuthenticating}
            className="text-gray-500 hover:text-white transition-colors text-sm"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}