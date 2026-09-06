import React from "react";

function InputField({
  id,
  label,
  type = "text",
  placeholder,
  required = false,
  autoComplete,
  helperText,
  rightLabelAction,
  defaultValue,
}) {
  return (
    <div className="input-group">
      <div className="input-label-row">
        <label htmlFor={id} className="input-label">
          {label}
        </label>
        {rightLabelAction}
      </div>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className="input-field"
      />
      {helperText && <span className="input-helper">{helperText}</span>}
    </div>
  );
}

export default InputField;
