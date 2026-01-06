import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
}

export const PhoneInput = ({ 
  value, 
  onChange, 
  countryCode = "+880",
  placeholder = "1234 567 890",
  className,
  ...props 
}: PhoneInputProps) => {
  const formatPhoneNumber = (rawValue: string) => {
    const digits = rawValue.replace(/\D/g, '');
    const limitedDigits = digits.slice(0, 10);
    
    if (limitedDigits.length <= 4) {
      return limitedDigits;
    } else if (limitedDigits.length <= 7) {
      return `${limitedDigits.slice(0, 4)} ${limitedDigits.slice(4)}`;
    } else {
      return `${limitedDigits.slice(0, 4)} ${limitedDigits.slice(4, 7)} ${limitedDigits.slice(7)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />
      <div className="relative flex items-stretch bg-card rounded-xl border-2 border-border overflow-hidden transition-all duration-300 group-focus-within:border-primary/50">
        <div className="flex items-center gap-2 px-4 py-3.5 bg-muted/60 border-r border-border">
          <span className="text-xl">🇧🇩</span>
          <span className="text-base font-semibold text-foreground tracking-wide">{countryCode}</span>
        </div>
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "flex-1 px-4 py-3.5 bg-transparent text-lg font-medium text-foreground",
            "placeholder:text-muted-foreground/60 placeholder:font-normal",
            "focus:outline-none transition-all duration-200",
            "tracking-widest",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
};