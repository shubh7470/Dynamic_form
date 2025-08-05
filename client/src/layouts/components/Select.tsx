import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectInput({
  width = "100%",
  placeholder = "select",
  title,
  values,
  onChange,
  value,
  error = "",
}: {
  width: string;
  placeholder: string;
  title: string;
  values: {
    name: string;
    value: any;
  }[];
  onChange: (value: any) => void;
  value: any;
  error?: string;
}) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger
        className={`w-[${width}] ${error ? "border-red-500" : ""}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{title}</SelectLabel>
          {values.map((value, index) => (
            <SelectItem key={index} value={value.value}>
              {value.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
