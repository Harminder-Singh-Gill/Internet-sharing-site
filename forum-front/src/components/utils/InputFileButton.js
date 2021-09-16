import { useRef } from "react";

const InputFileButton = (props) => {
    const {className, children, ...restProps} = props;
    const fileInputRef = useRef();

    return (<>
        <input type="file" ref={fileInputRef} onClick={e => e.target.value=""} {...restProps} style={{display: 'none'}}></input>
        <button onClick={() => fileInputRef.current.click()} className={className}>{children}</button>
    </>);
}
 
export default InputFileButton;