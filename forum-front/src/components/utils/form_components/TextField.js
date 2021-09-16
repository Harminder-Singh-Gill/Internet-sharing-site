import './TextField.css';

const TextField = (props) => {
    return ( 
        <div className={"text-field " + (props.className || "") + " " + (props.error ? 'error': '') + " " + (props.valid ? 'valid': '') + (props.disabled ? 'disabled': '')}>
            <input className= {props.inputClassName}
            onChange={props.onChange || (()=> {})}
            onBlur={props.onBlur || (()=> {})}
            required={props.required}
            type={props.type}
            name={props.name}
            disabled={props.disabled}
            value={props.value}
            placeholder={props.placeholder}
            ></input>
            {props.helperText && <div className="helper-text">{props.helperText}</div>}
        </div>
     );
}
 
export default TextField;