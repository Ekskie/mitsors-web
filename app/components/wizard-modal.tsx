'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { getRegionOptions, getCityOptions } from '@/constants/philippine-locations';
import { useUserProfile } from '@/hooks/use-user-profile';

interface WizardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WizardModal({ open, onOpenChange }: WizardModalProps) {
  const router = useRouter();
  const { setAnonymousProfile } = useUserProfile();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [userRoles, setUserRoles] = useState<string[]>([]);

  const totalSteps = 3;

  const regionOptions = useMemo(() => getRegionOptions(), []);
  const cityOptions = useMemo(() => getCityOptions(region), [region]);

  const toggleRole = (role: string) => {
    setUserRoles((current) =>
      current.includes(role) ? current.filter((r) => r !== role) : [...current, role]
    );
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete wizard
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const payload = {
      firstName,
      lastName,
      region,
      city,
      userRoles,
    };

    setAnonymousProfile(payload);
    router.push('/dashboard');

    // Reset and close for next open
    setStep(1);
    setFirstName('');
    setLastName('');
    setRegion('');
    setCity('');
    setUserRoles([]);
    onOpenChange(false);
  };

  const canProceed = () => {
    if (step === 1) return firstName.trim() !== '' && lastName.trim() !== '';
    if (step === 2) return region !== '' && city !== '';
    if (step === 3) return userRoles.length > 0;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-600">
            Welcome to MITSORS
          </DialogTitle>
          <DialogDescription>
            Let's personalize your experience in just a few steps
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    s === step
                      ? 'bg-emerald-600 text-white'
                      : s < step
                        ? 'bg-emerald-500 text-white'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s < step ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < totalSteps && (
                  <div
                    className={`mx-2 h-1 w-16 ${s < step ? 'bg-emerald-500' : 'bg-muted'}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Tell us about you</h3>
                <p className="text-sm text-muted-foreground">We use this to personalize your dashboard.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Juan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dela Cruz"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Where are you located?</h3>
                <p className="text-sm text-muted-foreground">We’ll default prices to your area.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Combobox
                    options={regionOptions}
                    value={region}
                    onValueChange={(value) => {
                      setRegion(value);
                      setCity('');
                    }}
                    placeholder="Select or type region..."
                    emptyMessage="No region found"
                  />
                </div>
                <div className="space-y-2">
                  <Label>City / Municipality</Label>
                  <Combobox
                    options={cityOptions}
                    value={city}
                    onValueChange={setCity}
                    placeholder={region ? 'Select city/municipality...' : 'Choose a region first'}
                    emptyMessage={region ? 'No city found' : 'Select a region first'}
                    disabled={!region}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Roles */}
          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Choose your roles</h3>
                <p className="text-sm text-muted-foreground">Select all that apply.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: 'farmer', label: 'Pig Farmer' },
                  { value: 'buyer', label: 'Buyer / Trader' },
                  { value: 'observer', label: 'Market Observer' },
                ].map((role) => {
                  const active = userRoles.includes(role.value);
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => toggleRole(role.value)}
                      className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
                        active
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-100'
                          : 'border-input text-foreground hover:border-emerald-500'
                      }`}
                    >
                      {role.label}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-lg bg-emerald-50 p-4 text-left text-sm dark:bg-emerald-950/20">
                <h4 className="mb-2 font-semibold text-emerald-900 dark:text-emerald-100">Profile summary</h4>
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{firstName || '—'} {lastName || ''}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{region || '—'} {city ? `• ${city}` : ''}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Roles:</span>
                    <span className="font-medium">{userRoles.length ? userRoles.join(', ') : '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {step === totalSteps ? (
              <>
                Get Started
                <Check className="h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
