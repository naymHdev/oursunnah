"use client";

import {
  type FieldPath,
  type FieldValues,
  type Control,
  useController,
} from "react-hook-form";
import { Input, type InputProps } from "@/components/ui/input";

type FormFieldProps<T extends FieldValues> = Omit<InputProps, "name"> & {
  name: FieldPath<T>;
  control: Control<T>;
};

export function FormField<T extends FieldValues>({
  name,
  control,
  ...inputProps
}: FormFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return <Input {...inputProps} {...field} error={error?.message} />;
}
