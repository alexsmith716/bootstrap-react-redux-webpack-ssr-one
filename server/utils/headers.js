
export default function headers(req, res, next) {
  // Request headers +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // identify the originating IP address through an HTTP proxy or load balancer
  res.header('X-Forwarded-For', req.ip);

  // Response headers ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Specifying which web sites can participate in CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept, x-auth');

  // Security headers ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // prevent MIME-sniffing a response away from the declared content-type
  res.header('X-Content-Type-Options', 'nosniff');
  // Clickjacking protection
  res.header('X-Frame-Options', 'deny');

  return next();
};

// ---------------- HELMET Pre-Sets --------------------------

// contentSecurityPolicy:   for setting Content Security Policy
// expectCt:                for handling Certificate Transparency
// dnsPrefetchControl:      controls browser DNS prefetching              ✓
// frameguard:              to prevent clickjacking                       ✓
// hidePoweredBy:           to remove the X-Powered-By header             ✓
// hpkp:                    for HTTP Public Key Pinning     
// hsts:                    for HTTP Strict Transport Security            ✓
// ieNoOpen:                sets X-Download-Options for IE8+              ✓
// noCache:                 to disable client-side caching  
// noSniff:                 to keep clients from sniffing the MIME type   ✓
// referrerPolicy:          to hide the Referer header   
// xssFilter:               adds some small XSS protections

// https://helmetjs.github.io/docs/