import axios from "axios";

export async function uploadToImgur(image: File): Promise<string | null> {
    if(!process.env.IMGUR_ACCESS_TOKEN) {
        return 'IMGUR_ACCESS_TOKEN environment variable undefined';
    }

    try {
        const formData = new FormData();
        formData.append('image', image);

        const response = await axios.post('https://api.imgur.com/3/image', formData,
        {
            headers: {
                Authorization: `Bearer ${process.env.IMGUR_ACCESS_TOKEN}`,
            }
        });
        
        return response.data.data.link;
    } catch (err) {
        console.error(err);
        return null;
    }
}