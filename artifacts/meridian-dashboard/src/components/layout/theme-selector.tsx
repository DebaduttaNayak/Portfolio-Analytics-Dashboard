import { useTheme } from "@/components/theme-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Paintbrush } from "lucide-react";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Select value={theme} onValueChange={(v) => setTheme(v as any)}>
      <SelectTrigger className="w-[140px] h-8 bg-secondary/50 border-border text-xs">
        <div className="flex items-center gap-2">
          <Paintbrush size={14} className="text-muted-foreground" />
          <SelectValue placeholder="Select theme" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="meridian">Meridian (Default)</SelectItem>
        <SelectItem value="bloomberg">Bloomberg</SelectItem>
        <SelectItem value="refinitiv">Refinitiv</SelectItem>
        <SelectItem value="midnight">Midnight</SelectItem>
        <SelectItem value="arctic">Arctic</SelectItem>
      </SelectContent>
    </Select>
  );
}
