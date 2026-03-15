import * as React from "react"
import { Check } from "lucide-react"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", onCheckedChange, checked, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      props.onChange?.(e);
    };

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          className="sr-only peer"
          {...props}
        />
        <div className={`w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-orange-500 peer-checked:border-orange-500 peer-focus:ring-2 peer-focus:ring-orange-500 peer-focus:ring-offset-1 flex items-center justify-center cursor-pointer transition-colors ${className}`}>
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
