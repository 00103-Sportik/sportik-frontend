import React, { ChangeEventHandler, InputHTMLAttributes, MouseEventHandler, useCallback, useState } from 'react';
import { AiFillEyeInvisible, AiOutlineClose, AiOutlineEye } from 'react-icons/ai';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: 'email' | 'password' | 'text' | 'file' | 'number';
  value?: string;
  placeholder?: string;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClear?: MouseEventHandler<HTMLButtonElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
}
export function Input(props: InputProps) {
  const { children, disabled, placeholder, errorText, error, type, required, onClear, ...otherProps } = props;
  const [isVisible, setIsVisible] = useState(false);
  const onClickChangeVisible = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);

  const isPassword = type === 'password' && !isVisible ? 'password' : 'text';
  const inpClassName = `${'input'} ${disabled ? 'input-disabled' : 'input'} ${error ? 'input-error' : 'input'}`;
  return (
    <div>
      <div>
        <input
          type={type !== 'password' ? type : isPassword}
          className={inpClassName}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          {...otherProps}
        />
        {children}

        {(type === 'text' || type === 'email' || type === 'number') && (
          <button type="button" onClick={onClear} className="">
            <AiOutlineClose />
          </button>
        )}

        {type === 'password' && (
          <button type="button" onClick={onClickChangeVisible}>
            {isVisible ? <AiOutlineEye /> : <AiFillEyeInvisible />}
          </button>
        )}
      </div>
      <p className="text-error">{error && errorText}</p>
    </div>
  );
}
