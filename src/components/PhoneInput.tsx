import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { COUNTRIES, Country, DEFAULT_COUNTRY, detectCountry, flagEmoji } from '@/lib/countries';

interface PhoneInputProps {
  value: string; // international, digits-only (e.g. "59171234567")
  onChange: (next: string) => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function PhoneInput({ value, onChange, id, placeholder = '71234567', disabled }: PhoneInputProps) {
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [national, setNational] = useState('');
  const [open, setOpen] = useState(false);

  // Sync from external value on mount / when it changes externally
  useEffect(() => {
    const digits = value.replace(/\D/g, '');
    const { country: c, national: n } = detectCountry(digits);
    setCountry(c);
    setNational(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const emit = (nextCountry: Country, nextNational: string) => {
    const clean = nextNational.replace(/\D/g, '');
    onChange(nextCountry.dialCode + clean);
  };

  const onSelectCountry = (c: Country) => {
    setCountry(c);
    setOpen(false);
    emit(c, national);
  };

  const onNationalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, '');
    setNational(clean);
    emit(country, clean);
  };

  const items = useMemo(() => COUNTRIES, []);

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="shrink-0 gap-2 px-3"
          >
            <span className="text-lg leading-none">{flagEmoji(country.iso2)}</span>
            <span className="text-sm font-medium">+{country.dialCode}</span>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[280px]" align="start">
          <Command>
            <CommandInput placeholder="Buscar país o código…" />
            <CommandList>
              <CommandEmpty>Sin resultados.</CommandEmpty>
              <CommandGroup>
                {items.map((c) => (
                  <CommandItem
                    key={`${c.iso2}-${c.dialCode}`}
                    value={`${c.name} ${c.dialCode} ${c.iso2}`}
                    onSelect={() => onSelectCountry(c)}
                  >
                    <span className="text-lg mr-2">{flagEmoji(c.iso2)}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-muted-foreground text-sm ml-2">+{c.dialCode}</span>
                    <Check className={cn('ml-2 h-4 w-4', country.iso2 === c.iso2 && country.dialCode === c.dialCode ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        id={id}
        inputMode="tel"
        placeholder={placeholder}
        value={national}
        onChange={onNationalChange}
        disabled={disabled}
        maxLength={15}
      />
    </div>
  );
}
