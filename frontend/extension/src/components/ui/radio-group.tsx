import * as React from "react";

import { cn } from "../../lib/utils";

type BivariantCallback<Args extends unknown[] = unknown[], Return = void> = {
  bivarianceHack(...args: Args): Return;
}["bivarianceHack"];

interface RadioGroupContextValue {
  value?: string;
  onChange: (value: string) => void;
  name: string;
}

const RadioGroupContext =
  React.createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: BivariantCallback<[string]>;
  name?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    { value, defaultValue, onValueChange, name, className, children, ...props },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const groupName = React.useId();

    React.useEffect(() => {
      if (defaultValue !== undefined) {
        setInternalValue(defaultValue);
      }
    }, [defaultValue]);

    const currentValue = value ?? internalValue;

    const handleChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <RadioGroupContext.Provider
        value={{
          value: currentValue,
          onChange: handleChange,
          name: name ?? groupName,
        }}
      >
        <div
          ref={ref}
          role="radiogroup"
          className={cn("grid gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);

    const checked =
      context?.value !== undefined
        ? context.value === value
        : Boolean(props.checked);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (value !== undefined) {
        context?.onChange(value.toString());
      }
      onChange?.(event);
    };

    return (
      <input
        type="radio"
        ref={ref}
        value={value}
        name={context?.name}
        checked={checked}
        onChange={handleChange}
        className={cn(
          "h-4 w-4 shrink-0 rounded-full border border-input text-primary accent-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
