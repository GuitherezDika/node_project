import jwt, { decode } from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        // set headers auth pada Interceptor API client
        // cek token yang tercreate saat proses api registration 
        const isCustomAuth = token.length < 500;
        // < 500 == token dicreate oleh api regist
        // > 500 = token didapat dari google authentication
        let decodeData;

        if (token && isCustomAuth) {
            decodeData = jwt.verify(token, 'test');// password dari token api   
            req.userId = decodeData?.id 
        } else {
            decodeData = jwt.decode(token);
            req.userId = decodeData?.sub; // credential id dicreate dari google auth
        }
        next()
    } catch (error) {
        console.log(error);
    }
}

export default auth;