
import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/data/countries";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function PhoneInput({ value = '', onChange, className, placeholder }: PhoneInputProps) {
  // Store ISO code (e.g. 'US') for checking selection info
  const [selectedIso, setSelectedIso] = useState('US');
  const [number, setNumber] = useState('');

  useEffect(() => {
    // Only parse if value exists and mismatch
    if (!value) return;

    // Find country matching the start of value
    // Sort by dialCode length desc to match +1242 before +1
    const sortedCountries = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
    const match = sortedCountries.find(c => value.startsWith(c.dialCode));

    if (match) {
      // Avoid state updates if already consistent to prevent loops/cursor jumps
      // But here we just set internal state
      if (selectedIso !== match.code || number !== value.slice(match.dialCode.length)) {
        setSelectedIso(match.code);
        setNumber(value.slice(match.dialCode.length));
      }
    } else {
      // Fallback: keep existing selectedIso or default, put whole value in number ??
      // or just ignore if it doesn't look like a phone number with code
      setNumber(value);
    }
  }, [value]);

  const handleCountryChange = (iso: string) => {
    setSelectedIso(iso);
    const country = countries.find(c => c.code === iso);
    if (country) {
      onChange(`${country.dialCode}${number}`);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/[^0-9]/g, '');
    setNumber(newNumber);
    const country = countries.find(c => c.code === selectedIso);
    if (country) {
      onChange(`${country.dialCode}${newNumber}`);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Select value={selectedIso} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[110px] shrink-0">
          {(() => {
            const selectedCountry = countries.find(c => c.code === selectedIso);
            if (selectedCountry) {
              return (
                <span className="flex items-center gap-2">
                  <span className="text-lg leading-none">{selectedCountry.flag}</span>
                  <span>{selectedCountry.dialCode}</span>
                </span>
              );
            }
            return <SelectValue placeholder="+1" />;
          })()}
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-[300px]">
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <span className="flex items-center justify-between w-full gap-2">
                  <span className="flex items-center gap-2">
                    <span className="text-lg leading-none">{country.flag}</span>
                    <span>{country.dialCode}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{country.code}</span>
                </span>
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={number}
        onChange={handleNumberChange}
        placeholder={placeholder || "Phone number"}
        className="flex-1"
      />
    </div>
  );
}
