import './TextField.css';

const TextAreaField = ({
    className='',
    label='',
    type='text',
    helperText,
    labelClassName='',
    inputClassName, 
    helperTextClassName='',
    onChange,
    onBlur,
    required,
    name,
    error,
    disabled,
    valid,
    value,
    placeholder,
}) => {
    return ( 
        <div className={"text-area-field " + className + " " + (error ? 'error': '') + " " + (valid ? 'valid': '')}>
            <label className={labelClassName}>{label}</label>
            <textarea 
            onChange={onChange} 
            onBlur={onBlur} 
            required={required} 
            className={inputClassName} 
            type={type}
            name={name}
            disabled={disabled}
            value={value}
            placeholder={placeholder}
            ></textarea>
            {helperText && <div className={"helper-text " + helperTextClassName}>{helperText}</div>}
        </div>
     );
}
 
export default TextAreaField;