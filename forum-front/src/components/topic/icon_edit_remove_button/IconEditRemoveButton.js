import axiosInstance from 'axiosInstance';
import IconUploader from 'components/specific_utils/icon_uploader/IconUploader2';
import InputFileButton from 'components/utils/InputFileButton';
import Modal from 'components/utils/modal/Modal';
import { useRef, useState } from 'react';
import './IconEditRemoveButton.css';

const IconEditRemoveButton = ({onSave, onRemove, className}) => {
    const [newIcon, setNewIcon] = useState();

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const reader = new FileReader();
          reader.addEventListener("load", () => setNewIcon(reader.result));
          reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className={"icon-edit-remove-button " + (className ? className : "")}>
            <InputFileButton className="edit-btn button" onChange={onSelectFile}>Edit</InputFileButton>
            <button onClick={onRemove} className="remove-btn button">Remove</button>
            <Modal visible={newIcon} handleClose={() => setNewIcon(null)}>
                <IconUploader src={newIcon} onSave={onSave} onCancel={() => setNewIcon(null)}/>
            </Modal>
        </div>
     );
}
 
export default IconEditRemoveButton;