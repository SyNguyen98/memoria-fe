import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import heic2any from "heic2any";

const useHeicImgQuery = (url: string) => {
    return useQuery({
        queryKey: ['getHeicImg'],
        queryFn: async (): Promise<Response> => {
            return await fetch(url);
        }
    })
}

const HeicImg = ({alt, url}: { alt: string, url: string }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const heicImageQuery = useHeicImgQuery(url);

    useEffect(() => {
        if (heicImageQuery.data) {
            heicImageQuery.data.blob().then(blob => {
                heic2any({ blob, toType: "image/jpeg" }).then(convertedBlob => {
                    const objectUrl = URL.createObjectURL(convertedBlob as Blob);
                    setImageSrc(objectUrl);
                });
            });
        }
    }, [heicImageQuery.data, url]);

    return (
        imageSrc && <img src={imageSrc} alt={alt} style={{width: '100%', height: 'auto'}}/>
    );
};

export default HeicImg;