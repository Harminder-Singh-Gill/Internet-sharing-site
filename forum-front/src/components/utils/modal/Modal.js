import './Modal.css';

const Modal = (props) => {
    if (!props.visible) return null;
    return (
        <div className="modal" onClick={props.handleClose || (()=>{})}>
            <div className="modal-main" onClick={(e) => e.stopPropagation()}>
                {props.children}
            </div>
        </div> 
     );
}
 
export default Modal;