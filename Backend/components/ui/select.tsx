import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, onValueChange, ...props }, ref) => {
    return (
      <select
        ref={ref}
        {...props}
        onChange={(e) => {
          if (onValueChange) {
            onValueChange(e.target.value);
          }
          if (props.onChange) {
            props.onChange(e);
          }
        }}
        className={`bg-[#2c3035] text-white border-none rounded-md p-2 ${
          props.className || ""
        }`}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

const Option: React.FC<OptionProps> = ({ children, ...props }) => (
  <option {...props}>{children}</option>
);

Option.displayName = "Option";

export { Select, Option };
