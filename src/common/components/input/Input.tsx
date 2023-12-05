import React, { ChangeEventHandler, InputHTMLAttributes, MouseEventHandler, useCallback, useState } from 'react';
import { AiFillEyeInvisible, AiOutlineClose, AiOutlineEye } from 'react-icons/ai';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: 'email' | 'password' | 'text';
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
  const [isVisible, setIsVisible] = useState(false);
  const onClickChangeVisible = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);

  const isPassword = props.type === 'password' && !isVisible ? 'password' : 'text';
  const inpClassName = `$props.inputClassName || ''} ${'input'} ${props.disabled ? 'input-disabled' : 'input'} ${
    props.error ? 'input-error' : 'input'
  }`;
  return (
    <div>
      <div>
        <input
          type={props.type !== 'password' ? props.type : isPassword}
          className={inpClassName}
          disabled={props.disabled}
          placeholder={props.placeholder}
          required={props.required}
          {...props}
        />
        {props.children}

        {(props.type === 'text' || props.type === 'email') && (
          <button type="button" onClick={props.onClear} className="">
            <AiOutlineClose />
          </button>
        )}

        {props.type === 'password' && (
          <button type="button" onClick={onClickChangeVisible}>
            {isVisible ? <AiOutlineEye /> : <AiFillEyeInvisible />}
          </button>
        )}
      </div>
      <p className="text-error">{props.error && props.errorText}</p>
    </div>
  );
}
