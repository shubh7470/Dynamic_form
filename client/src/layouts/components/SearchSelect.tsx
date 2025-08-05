"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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

export function SearchSelect({
  width = "200px",
  className,
  data,
  value,
  setValue,
  title,
  notFound,
  placeholder,
}: {
  width: string;
  data: {
    value: string;
    label: string;
  }[];
  value: string;
  setValue: (value: string) => void;
  title: string;
  notFound: string;
  placeholder: string;
  className: string;
}) {
  const [open, setOpen] = React.useState(false);
  // console.log(data);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(`w-[${width}] ${className}`, "justify-between ")}
        >
          {value ? data.find((data) => data.value === value)?.label : title}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(`w-[100%]`, "p-0")}>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{notFound}</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label} // searchable by label
                  onSelect={(label) => {
                    const matched = data.find((d) => d.label === label);
                    if (matched) {
                      setValue(matched.value); // store actual value
                    }
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
