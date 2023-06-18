export default function (req, res, next) {
    res.setHeader('Content-Security-Policy', "img-src 'self' data: res.cloudinary.com");
    next();
  }
  