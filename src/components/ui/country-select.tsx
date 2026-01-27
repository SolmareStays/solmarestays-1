
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/data/countries";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CountrySelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CountrySelect({ value, onChange, placeholder = "Select a country", className }: CountrySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[300px]">
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center gap-2">
                <span className="text-lg leading-none">{country.flag}</span>
                <span className="text-muted-foreground w-6 text-xs">{country.code}</span>
                {country.name}
              </span>
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
