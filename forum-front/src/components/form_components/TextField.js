import './TextField.css';

const TextField = ({
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
    value
}) => {
    return ( 
        <div className={"text-field " + className + " " + (error ? 'error': '') + " " + (valid ? 'valid': '')}>
            <label className={labelClassName}>{label}</label>
            <input 
            onChange={onChange} 
            onBlur={onBlur} 
            required={required} 
            className={inputClassName} 
            type={type}
            name={name}
            disabled={disabled}
            value={value}
            ></input>
            {helperText && <div className={"helper-text " + helperTextClassName}>{helperText}</div>}
        </div>
     );
}
 
export default TextField;