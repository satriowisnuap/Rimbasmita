"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Mountain, Search } from "lucide-react";
import * as React from "react";

interface Trail {
  id: string;
  name: string;
  location?: string;
}

interface Props {
  trails: Trail[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function TrailSelect({ trails, value, onValueChange, disabled }: Props) {
  const [open, setOpen] = React.useState(false);

  const selectedTrail = trails.find((trail) => trail.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between bg-card/50 border-border rounded-xl px-4 py-6 text-sm font-normal hover:bg-card/80 transition-all",
            !value && "text-muted-foreground",
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Mountain
              className={cn(
                "h-4 w-4 shrink-0",
                value ? "text-primary" : "text-muted-foreground",
              )}
            />

            <span className="truncate">
              {selectedTrail
                ? `${selectedTrail.name}${
                    selectedTrail.location ? ` - ${selectedTrail.location}` : ""
                  }`
                : "Pilih jalur pendakian"}
            </span>
          </div>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl border-border bg-popover/95 backdrop-blur-sm"
        align="start"
      >
        <Command className="bg-transparent">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />

            <CommandInput
              placeholder="Cari nama gunung atau lokasi..."
              className="h-11 bg-transparent outline-none border-none focus:ring-0"
            />
          </div>

          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>Jalur tidak ditemukan.</CommandEmpty>

            <CommandGroup>
              {trails.map((trail) => (
                <CommandItem
                  key={trail.id}
                  value={`${trail.name} ${trail.location || ""}`}
                  onSelect={() => {
                    onValueChange(trail.id === value ? "" : trail.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-accent transition-colors"
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm border border-primary transition-all",
                      value === trail.id
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50",
                    )}
                  >
                    {value === trail.id && <Check className="h-3 w-3" />}
                  </div>

                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {trail.name}
                    </span>

                    {trail.location && (
                      <span className="text-xs text-muted-foreground">
                        {trail.location}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
