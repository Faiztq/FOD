import path from "path";
// define path (address) of root folder

export const BASE_URL = `${path.join(__dirname, "../")}`;
export const PORT = process.env.PORT;
export let SECRET = process.env.SECRET;

SECRET = "halo"