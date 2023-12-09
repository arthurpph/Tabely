import axios from "axios";

export async function uploadToImgur(image: Buffer) {
    if(!process.env.IMGUR_ACCESS_TOKEN) {
        return 'IMGUR_ACCESS_TOKEN environment variable undefined';
    }


    try {
        const blob = new Blob([image]); 
        const formData = new FormData();
        formData.append('image', blob, 'image.png');

        const response = await axios.post('https://api.imgur.com/3/image', formData,
        {
            headers: {
                Authorization: `Bearer ${process.env.IMGUR_ACCESS_TOKEN}`,
                "Content-Type": 'multipart/form-data'
            }
        });
        
        return response.data.data.link;
    } catch (err) {
        console.error(err);
        return null;
    }
}