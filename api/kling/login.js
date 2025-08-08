const axios = require('axios');

module.exports = async (req, res) => {
    // Enable CORS for all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Only POST requests are supported.',
            method: req.method
        });
    }

    try {
        console.log('Login request received:', { 
            method: req.method, 
            headers: req.headers,
            body: req.body 
        });

        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required',
                received: { email: !!email, password: !!password }
            });
        }

        console.log('Attempting login for email:', email);

        const loginUrl = 'https://id.klingai.com/pass/ksi18n/web/login/emailPassword';
        
        const requestData = {
            email: email,
            password: password
        };

        const requestHeaders = {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'origin': 'https://app.klingai.com',
            'pragma': 'no-cache',
            'referer': 'https://app.klingai.com/',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
        };

        console.log('Making request to Kling API:', {
            url: loginUrl,
            data: { email: email, password: '***' },
            headers: requestHeaders
        });

        const response = await axios.post(loginUrl, requestData, {
            headers: requestHeaders,
            timeout: 30000 // 30 second timeout
        });
        
        console.log('Kling API response status:', response.status);
        console.log('Kling API response data:', response.data);

        res.json({
            success: true,
            data: response.data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Login error details:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers
            }
        });

        // Return appropriate error response
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.status(error.response.status).json({
                success: false,
                error: error.response.data || 'Login failed',
                status: error.response.status,
                statusText: error.response.statusText,
                timestamp: new Date().toISOString()
            });
        } else if (error.request) {
            // The request was made but no response was received
            res.status(500).json({
                success: false,
                error: 'No response received from Kling API',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            res.status(500).json({
                success: false,
                error: 'Request setup failed',
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
}; 