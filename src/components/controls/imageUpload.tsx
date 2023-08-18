import React, { useRef } from "react";
import ButtonBase from "@mui/material/ButtonBase";

interface ClickableImageUploadProps {
    src: string;
    alt: string;
    onImageClick: (file: File) => void
    defaultImg?: string
}

function ClickableImageUpload(props: ClickableImageUploadProps) {
    const { src, alt, onImageClick, defaultImg } = props;
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // You can handle the file upload logic here
            onImageClick(selectedFile)
        }
    };

    return (
        <div>
            <ButtonBase
                onClick={handleImageClick}
                style={{ display: "block", cursor: "pointer" }}
            >
                <img src={src.length ? src : `${process.env.PUBLIC_URL}/assets/${defaultImg}`} alt={alt} />
            </ButtonBase>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </div>
    );
}

export default ClickableImageUpload;