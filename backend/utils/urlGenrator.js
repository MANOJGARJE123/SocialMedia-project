import DataUriParser from "datauri/parser.js";
import path from 'path';


//Takes a file (usually uploaded via Multer in Express) and converts it to a Data URL string.
const getDataUrl = (file) =>{
    const parser = new DataUriParser();

    const extName =  path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
    //does the main job of converting your uploaded file into a Data URL.
}

export default getDataUrl;

//path: Node.js built-in module used to work with file paths.