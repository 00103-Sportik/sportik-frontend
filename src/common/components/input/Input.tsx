import React, { ChangeEventHandler, InputHTMLAttributes, MouseEventHandler, useCallback, useState } from 'react';
import { AiFillEyeInvisible, AiOutlineEye } from 'react-icons/ai';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: 'email' | 'password' | 'text' | 'file';
  testid?: string;
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
  const { children, disabled, placeholder, errorText, error, type, required, onClear, testid, ...otherProps } = props;
  const [isVisible, setIsVisible] = useState(false);
  const onClickChangeVisible = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);

  const isPassword = type === 'password' && !isVisible ? 'password' : 'text';
  const inpClassName = `${'form-input'} ${disabled ? 'form-input-disabled' : 'form-input'} ${
    error ? 'form-input-err' : 'form-input'
  }`;
  const labelClassName = `${'form-label'} ${disabled ? 'form-label-disabled' : 'form-label'} ${
    error ? 'text-error' : 'form-label'
  } ${type === 'text' || type === 'email' ? 'items-start' : 'form-label'}`;
  return (
    <div>
      <div className="form-group">
        <input
          type={type !== 'password' ? type : isPassword}
          data-testid={testid + '-input'}
          className={inpClassName}
          disabled={disabled}
          placeholder={' '}
          required={required}
          {...otherProps}
        />
        {children}
        <label className={labelClassName}>{placeholder}</label>

        {type === 'password' && (
          <button type="button" onClick={onClickChangeVisible}>
            {isVisible ? <AiOutlineEye /> : <AiFillEyeInvisible />}
          </button>
        )}
      </div>
      <p data-testid={testid + '-error'} id="err" className="text-error break-word max-w-[200px]">
        {error && errorText}
      </p>
    </div>
  );
}
