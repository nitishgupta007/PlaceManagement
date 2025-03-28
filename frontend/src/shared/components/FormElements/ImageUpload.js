import React, { useRef, useState, useEffect } from 'react';
import './ImageUpload.css';
import Button from './Button';

const ImageUpload = props => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);
    const filePickerRef = useRef();

    useEffect(() => {
        if(!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        }
        fileReader.readAsDataURL(file)
    }, [file]);

    const pickedHandler = (event) => {
        console.log(event.target.files, 'event.target.files');
        let pickedFile;
        let fileIsValid = isValid;
        
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
            
            // Call props.onInput inside the if-block
            props.onInput(props.id, pickedFile, fileIsValid);
        } else {
            fileIsValid = false;
            setIsValid(false);
        }
    };
    

    const pickImageHandler = () => {
        if (filePickerRef.current) {
            filePickerRef.current.click();
        }
    };

    return (
        <div className="form-control">
            <input
                id={props.id}
                ref={filePickerRef}
                type="file"
                style={{ display: 'none' }}
                accept=".jpg, .png, .jpeg"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewUrl ? <img src={previewUrl} alt="preview"></img>: <p>Please pick an image</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    )
};

export default ImageUpload;
