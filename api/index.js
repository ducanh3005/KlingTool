const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const FormData = require('form-data');

const app = express();

// Global variable for cookies
let currentCookies = null;

// Configure multer for file uploads
const upload = multer({
    dest: '/tmp/',
    fileFilter: (req, file, cb) => {
        // Accept CSV files with various MIME types
        if (file.mimetype === 'text/csv' || 
            file.mimetype === 'application/csv' ||
            file.mimetype === 'text/plain' ||
            file.mimetype === 'application/vnd.ms-excel' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.originalname.toLowerCase().endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV and Excel files are allowed'));
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
});

app.get('/cookie-manager', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'cookie-manager.html'));
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Server is working!',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

// Simple test route
app.get('/test', (req, res) => {
    res.send('Hello from Kling Tool Server!');
});

// Retry function with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 2000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            const delay = baseDelay * Math.pow(2, i);
            console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms delay`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Generate video from image URL
async function generateVideoFromImage(imageUrl, prompt = null) {
    try {
        console.log(`Generating video from image: ${imageUrl}`);
        
        // Use dynamic cookies if available, otherwise fallback to hardcoded ones
        const cookiesToUse = currentCookies || 'did=web_1e1a96daaa302169a55f1f415e26e17a6df4; __risk_web_device_id=2619671d1740996067504651; KLING_LAST_ACCESS_REGION=global; _gcl_au=1.1.468414764.1754324670; _ga=GA1.1.719912853.1754324670; _clck=defdxu%7C2%7Cfy8%7C0%7C2042; userId=37904718; ksi18n.ai.portal_st=ChNrc2kxOG4uYWkucG9ydGFsLnN0EqABRlIQ9jqcURvoiHC6eIvmJqezdb_OmkVaJZ93FTnVXa_xUZjEPgdDhimA1qnZKxa-ENepmOQcK_sAxFAMqksGKXHg5h7HoQ9K3LOPh8JMlxzU8ZVjbqlnXZUIqbz5srgEcHwH8_dej-BLW0j1hgZl4xL-ado-qs8lsCF9Y8N_2tzU0gfO5T89qjpC4yelzfkeB8RsDfHHoYz8y7YRLwT-wxoS9ZUz3tcFLaUcdMJflnP7ahvOIiCFFASSbhc4crxwFEWhILW6WiWulEBW7gqB7lmUpPBCfigFMAE; ksi18n.ai.portal_ph=5a1d61e4637892da9e734f3478588035a168; _clsk=1dvx8am%7C1754452791039%7C3%7C1%7Cj.clarity.ms%2Fcollect; _uetsid=97169d40726c11f0825ced3e20476fab; _uetvid=d1939eb0b6c611efb5d48b5053d95a86; _ga_MWG30LDQKZ=GS2.1.s1754499900$o6$g1$t1754499923$j37$l0$h572507615; ak_bmsc=C624D6818F65F5FE8286677D4FEE6803~000000000000000000000000000000~YAAQT6s3F+tW+3iYAQAAi0ZYgBw46Ujfti3bZiVL+uHGu8Z5/8mk3CfqTUoc9GYnJoc4BaP/sG7oJsswdstpUIGHBYqhrcmD/5JIRZ+0ZnwA+t/BmJeIKRSwaoGpzAT2CM2lla8iD63teE9AiYii5hMpBHvOqvywxYpr80wd5sJl7XjHtsj8TydTZ7TYfI5vUWoc5TYgB53fRHQvMFB9f1zDPjrgDdoSW4hM3sDNwG63HaoSib4G/i5L64ms+EVmoTDSxZHk2of79zfgzhlP8QYM0Aef+wNJhdGfK0yiy4wg4mwSmXT/WG4iVaeUyy94qLe3a35+NPZTAz87AuISsK39QtHqIX0XM4rqSm+bswxr0pacxePJvHAL+xNYoRSFFhV2hShUvvapQxhY4DTuT5N4; bm_sv=2911014728270099EDE3909E51EC559A~YAAQT6s3FwdX+3iYAQAARFVYgBxn2hX70IJ7sCUiQpN2pzJSxF9wKgl4RArtVkGiVDaYbIuJzK6FDiaCk3xGac0lA53AgzWQfMuNz7T+wiQEM6VzH5BuEt67sMUiWfq/Ccl3IROUERRIV+sqfcu2cp20XhXHuvEat+y5nU2xFwMkHbnE4Yngd3uRpatHQUcViK94yXGP2CLGkonb5unxSgBVgC6Za21jrQm7emx2QuGOzpGS42jXB79LHosyZuSiaQ==~1';
        
        console.log(`Using ${currentCookies ? 'dynamic' : 'fallback'} cookies for video generation`);
        
        // Default prompt if not provided
        const defaultPrompt = "The woman with long wavy blonde hair tilts her head slightly, her light blue eyes gazing softly into the distance as a gentle breeze lifts strands of her hair. The pristine white background gradually reveals faint golden light particles floating upward, maintaining the clean polished aesthetic while the camera slowly zooms in to emphasize her serene expression and subtle pink lips.";
        const finalPrompt = prompt || defaultPrompt;
        
        // Step 1: Call OPTIONS request
        console.log('Calling OPTIONS request for video generation...');
        await axios.options('https://api-app-global.klingai.com/api/task/submit', {
            params: {
                __NS_hxfalcon: 'HUDR_sFnX-FFuAW5VsfDNK0XOP6snthhLcvIxjxBz8_r61UvYFIc7AGaHwcmlb_Lw36QFxBn0Bj4EKN4Zb24e3VuXsMYqgdcC2VAhO0_LMZjDhJK9nym8Jrx2cnp4iNdoYGECPbgEPyzfyJ_9LRRA2kT4Wi-fsgpPhcwt79cK7Hy9w4ZK644eMCLcihAJ9lm17QsTGX880s53arOchiN1dI7xhoAsBj90hSG_ecp2rus3-ZydGvYbAfbFL-prHTuceGidhzifIed1gmqLk4JRPDwqXNcKYRKeybgdilmszEIERQIjwtqVNtDA47aF16LAIXj67azZT-A1NKHNCXjsPkpVsQzwfszYkr-0RcI2v8MxO4T_T5ntvUhx442y02kbvFJlTrbeJqEPitskMQ4k59ngfBaBx-Hv3LDnvercwKKEJc0zfMk-KFhDnjaW6AKdcOrx3YdgybmhwYctB3cx3crwr4Uw2WXAghbxv6OE8KezDFCFtJ8poastIj3F6RWq0uQMN8zrSNiFcDAs5CeE-S2gXxdUx7ZANM5zAnwXDsyPNM4kyDtzSoNTcSmNPjiC8NvwDS6WW1YXdRHy6qY0no9BHmF7H9BppC1U65gnNXLfFRSDBrHWbsxgkq3yaeq4JlGoAbP0ToMQP2uHHG9IIKCDPu1zN1F9Pi7oiv-uCK1woHRUvrBLYUyR4eGV0yltmu0AaeVkdHlI-WvRO76ZLqu4_AJUP90npD0vuhYf$HE_9a851d787a3109865149d06fcaaf77369ed0d1d1d1d0c6497d6bc45ff7322392eb9b49d04a87ef0baa87ef39d1',
                caver: '2'
            },
            headers: {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'access-control-request-headers': 'content-type,time-zone',
                'access-control-request-method': 'POST',
                'cache-control': 'no-cache',
                'origin': 'https://app.klingai.com',
                'pragma': 'no-cache',
                'priority': 'u=1, i',
                'referer': 'https://app.klingai.com/',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0'
            },
            timeout: 30000
        });
        
        // Step 2: Call POST request to submit video generation task
        console.log('Submitting video generation task...');
        const taskData = {
            type: "m2v_img2video_hq",
            arguments: [
                { name: "prompt", value: finalPrompt },
                { name: "negative_prompt", value: "" },
                { name: "duration", value: "5" },
                { name: "imageCount", value: "1" },
                { name: "kling_version", value: "2.1" },
                { name: "camera_json", value: '{"type":"empty","horizontal":0,"vertical":0,"zoom":0,"tilt":0,"pan":0,"roll":0}' },
                { name: "camera_control_enabled", value: "false" },
                { name: "biz", value: "klingai" },
                { name: "enable_audio", value: "true" }
            ],
            inputs: [
                {
                    inputType: "URL",
                    url: imageUrl,
                    name: "input"
                }
            ]
        };
        
        const submitResponse = await axios.post('https://api-app-global.klingai.com/api/task/submit', taskData, {
            params: {
                __NS_hxfalcon: 'HUDR_sFnX-FFuAW5VsfDNK0XOP6snthhLcvIxjxBz8_r61UvYFIc7AGaHwcmlb_Lw36QFxBn0Bj4EKN4Zb24e3VuXsMYqgdcC2VAhO0_LMZjDhJK9nym8Jrx2cnp4iNdoYGECPbgEPyzfyJ_9LRRA2kT4Wi-fsgpPhcwt79cK7Hy9w4ZK644eMCLcihAJ9lm17QsTGX880s53arOchiN1dI7xhoAsBj90hSG_ecp2rus3-ZydGvYbAfbFL-prHTuceGidhzifIed1gmqLk4JRPDwqXNcKYRKeybgdilmszEIERQIjwtqVNtDA47aF16LAIXj67azZT-A1NKHNCXjsPkpVsQzwfszYkr-0RcI2v8MxO4T_T5ntvUhx442y02kbvFJlTrbeJqEPitskMQ4k59ngfBaBx-Hv3LDnvercwKKEJc0zfMk-KFhDnjaW6AKdcOrx3YdgybmhwYctB3cx3crwr4Uw2WXAghbxv6OE8KezDFCFtJ8poastIj3F6RWq0uQMN8zrSNiFcDAs5CeE-S2gXxdUx7ZANM5zAnwXDsyPNM4kyDtzSoNTcSmNPjiC8NvwDS6WW1YXdRHy6qY0no9BHmF7H9BppC1U65gnNXLfFRSDBrHWbsxgkq3yaeq4JlGoAbP0ToMQP2uHHG9IIKCDPu1zN1F9Pi7oiv-uCK1woHRUvrBLYUyR4eGV0yltmu0AaeVkdHlI-WvRO76ZLqu4_AJUP90npD0vuhYf$HE_9a851d787a3109865149d06fcaaf77369ed0d1d1d1d0c6497d6bc45ff7322392eb9b49d04a87ef0baa87ef39d1',
                caver: '2'
            },
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en',
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                'origin': 'https://app.klingai.com',
                'pragma': 'no-cache',
                'priority': 'u=1, i',
                'referer': 'https://app.klingai.com/',
                'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'time-zone': 'Asia/Saigon',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
                'Cookie': cookiesToUse
            },
            timeout: 30000
        });
        
        console.log('Video generation task submitted:', JSON.stringify(submitResponse.data, null, 2));
        
        if (submitResponse.data.result === 1 && submitResponse.data.data && submitResponse.data.data.task) {
            const task = submitResponse.data.data.task;
            console.log(`Video generation task created with ID: ${task.id}`);
            
            return {
                success: true,
                message: 'Video generation task submitted successfully',
                taskId: task.id,
                taskStatus: task.status,
                taskType: task.type,
                createTime: task.createTime,
                updateTime: task.updateTime,
                fullResponse: submitResponse.data
            };
        } else {
            throw new Error(`Video generation failed: ${submitResponse.data.message || 'Unknown error'}`);
        }
        
    } catch (error) {
        console.error('Video generation error:', error);
        throw new Error(`Failed to generate video: ${error.message}`);
    }
}

// Upload image to Kling
async function uploadImageToKling(imageUrl, prompt = null) {
    try {
        console.log(`Processing image: ${imageUrl}`);
        
        // Use dynamic cookies if available, otherwise fallback to hardcoded ones
        const cookiesToUse = currentCookies || 'did=web_1e1a96daaa302169a55f1f415e26e17a6df4; __risk_web_device_id=2619671d1740996067504651; KLING_LAST_ACCESS_REGION=global; _gcl_au=1.1.468414764.1754324670; _ga=GA1.1.719912853.1754324670; _clck=defdxu%7C2%7Cfy8%7C0%7C2042; userId=37904718; ksi18n.ai.portal_st=ChNrc2kxOG4uYWkucG9ydGFsLnN0EqABRlIQ9jqcURvoiHC6eIvmJqezdb_OmkVaJZ93FTnVXa_xUZjEPgdDhimA1qnZKxa-ENepmOQcK_sAxFAMqksGKXHg5h7HoQ9K3LOPh8JMlxzU8ZVjbqlnXZUIqbz5srgEcHwH8_dej-BLW0j1hgZl4xL-ado-qs8lsCF9Y8N_2tzU0gfO5T89qjpC4yelzfkeB8RsDfHHoYz8y7YRLwT-wxoS9ZUz3tcFLaUcdMJflnP7ahvOIiCFFASSbhc4crxwFEWhILW6WiWulEBW7gqB7lmUpPBCfigFMAE; ksi18n.ai.portal_ph=5a1d61e4637892da9e734f3478588035a168; _clsk=1dvx8am%7C1754452791039%7C3%7C1%7Cj.clarity.ms%2Fcollect; _uetsid=97169d40726c11f0825ced3e20476fab; _uetvid=d1939eb0b6c611efb5d48b5053d95a86; _ga_MWG30LDQKZ=GS2.1.s1754499900$o6$g1$t1754499923$j37$l0$h572507615; ak_bmsc=C624D6818F65F5FE8286677D4FEE6803~000000000000000000000000000000~YAAQT6s3F+tW+3iYAQAAi0ZYgBw46Ujfti3bZiVL+uHGu8Z5/8mk3CfqTUoc9GYnJoc4BaP/sG7oJsswdstpUIGHBYqhrcmD/5JIRZ+0ZnwA+t/BmJeIKRSwaoGpzAT2CM2lla8iD63teE9AiYii5hMpBHvOqvywxYpr80wd5sJl7XjHtsj8TydTZ7TYfI5vUWoc5TYgB53fRHQvMFB9f1zDPjrgDdoSW4hM3sDNwG63HaoSib4G/i5L64ms+EVmoTDSxZHk2of79zfgzhlP8QYM0Aef+wNJhdGfK0yiy4wg4mwSmXT/WG4iVaeUyy94qLe3a35+NPZTAz87AuISsK39QtHqIX0XM4rqSm+bswxr0pacxePJvHAL+xNYoRSFFhV2hShUvvapQxhY4DTuT5N4; bm_sv=2911014728270099EDE3909E51EC559A~YAAQT6s3FwdX+3iYAQAARFVYgBxn2hX70IJ7sCUiQpN2pzJSxF9wKgl4RArtVkGiVDaYbIuJzK6FDiaCk3xGac0lA53AgzWQfMuNz7T+wiQEM6VzH5BuEt67sMUiWfq/Ccl3IROUERRIV+sqfcu2cp20XhXHuvEat+y5nU2xFwMkHbnE4Yngd3uRpatHQUcViK94yXGP2CLGkonb5unxSgBVgC6Za21jrQm7emx2QuGOzpGS42jXB79LHosyZuSiaQ==~1';
        
        console.log(`Using ${currentCookies ? 'dynamic' : 'fallback'} cookies`);
        
        // Step 1: Get upload token from Kling
        const timestamp = Date.now();
        const filename = `image_${timestamp}.jpg`;
        console.log(`Getting upload token for: ${filename}`);
        
        const tokenResponse = await axios.get('https://api-app-global.klingai.com/api/upload/issue/token', {
            params: {
                filename: filename
            },
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en',
                'cache-control': 'no-cache',
                'origin': 'https://app.klingai.com',
                'pragma': 'no-cache',
                'priority': 'u=1, i',
                'referer': 'https://app.klingai.com/',
                'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'time-zone': 'Asia/Saigon',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
                'Cookie': cookiesToUse
            }
        });
        
        console.log('Token response:', tokenResponse.data);
        
        if (!tokenResponse.data.data || !tokenResponse.data.data.token) {
            throw new Error('Failed to get upload token from Kling');
        }
        
        const token = tokenResponse.data.data.token;
        const httpEndpoints = tokenResponse.data.data.httpEndpoints;
        
        console.log(`Got token: ${token.substring(0, 50)}...`);
        console.log(`HTTP endpoints: ${httpEndpoints}`);
        
        // Step 2: Download image to temp folder
        const tempImagePath = `/tmp/image_${timestamp}.jpg`;
        console.log(`Downloading image to: ${tempImagePath}`);
        const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });
        
        // Save image to temp
        fs.writeFileSync(tempImagePath, imageResponse.data);
        console.log(`Image saved to: ${tempImagePath}`);
        
        // Step 3: Upload image to endpoint (using first endpoint)
        let endpoint = null;
        if (httpEndpoints && httpEndpoints.length > 0) {
            endpoint = httpEndpoints[0];
            console.log(`Uploading to endpoint: ${endpoint}`);
            
            try {
                // Create form data with the downloaded image
                const formData = new FormData();
                formData.append('file', fs.createReadStream(tempImagePath), {
                    filename: filename,
                    contentType: 'image/jpeg'
                });
                
                const uploadUrl = `https://${endpoint}/upload`;
                console.log(`Upload URL: ${uploadUrl}`);
                
                const uploadResponse = await axios.post(uploadUrl, formData, {
                    headers: {
                        ...formData.getHeaders(),
                        'Authorization': `Bearer ${token}`,
                        'Origin': 'https://app.klingai.com',
                        'Referer': 'https://app.klingai.com/',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0'
                    },
                    timeout: 30000
                });
                
                console.log('Upload response:', uploadResponse.data);
            } catch (uploadError) {
                console.log('Direct upload failed, this is expected for Kling API:', uploadError.message);
                // Continue to verify token as upload might work differently
            }
        }
        
        // Step 4: Upload fragment
        if (endpoint) {
            console.log('Uploading fragment...');
            
            // Read the image file
            const imageBuffer = fs.readFileSync(tempImagePath);
            const fileSize = imageBuffer.length;
            
            const fragmentResponse = await axios.post(`https://${endpoint}/api/upload/fragment`, imageBuffer, {
                params: {
                    upload_token: token,
                    fragment_id: 0
                },
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'en-US,en;q=0.9',
                    'cache-control': 'no-cache',
                    'content-range': `bytes 0-${fileSize - 1}/${fileSize}`,
                    'content-type': 'application/octet-stream',
                    'origin': 'https://app.klingai.com',
                    'pragma': 'no-cache',
                    'priority': 'u=1, i',
                    'referer': 'https://app.klingai.com/',
                    'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'cross-site',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0'
                },
                timeout: 30000
            });
            
            console.log('Fragment upload response:', fragmentResponse.data);
        }
        
        // Step 5: Complete upload
        if (endpoint) {
            console.log('Completing upload...');
            const completeResponse = await axios.post(`https://${endpoint}/api/upload/complete`, null, {
                params: {
                    fragment_count: 1,
                    upload_token: token
                },
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'en-US,en;q=0.9',
                    'cache-control': 'no-cache',
                    'origin': 'https://app.klingai.com',
                    'pragma': 'no-cache',
                    'priority': 'u=1, i',
                    'referer': 'https://app.klingai.com/',
                    'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'cross-site',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0'
                },
                timeout: 30000
            });
            
            console.log('Complete response:', completeResponse.data);
        }
        
        // Step 6: Verify token to get final URL
        console.log('Verifying token to get final image URL...');
        
        // First call OPTIONS request
        console.log('Calling OPTIONS request for verify...');
        await axios.options('https://api-app-global.klingai.com/api/upload/verify/token', {
            params: { token },
            headers: {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'access-control-request-headers': 'time-zone',
                'access-control-request-method': 'GET',
                'cache-control': 'no-cache',
                'origin': 'https://app.klingai.com',
                'pragma': 'no-cache',
                'priority': 'u=1, i',
                'referer': 'https://app.klingai.com/',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0'
            },
            timeout: 30000
        });
        
        // Then call GET request
        console.log('Calling GET request for verify...');
        const verifyResponse = await axios.get('https://api-app-global.klingai.com/api/upload/verify/token', {
            params: { token },
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en',
                'cache-control': 'no-cache',
                'origin': 'https://app.klingai.com',
                'pragma': 'no-cache',
                'priority': 'u=1, i',
                'referer': 'https://app.klingai.com/',
                'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'time-zone': 'Asia/Saigon',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
                'Cookie': cookiesToUse
            },
            timeout: 30000
        });
        
        console.log('Verify response:', verifyResponse.data);
        
        // Clean up temp file
        if (fs.existsSync(tempImagePath)) {
            fs.unlinkSync(tempImagePath);
            console.log(`Cleaned up temp file: ${tempImagePath}`);
        }
        
        if (verifyResponse.data.data && verifyResponse.data.data.url) {
            const klingUrl = verifyResponse.data.data.url;
            console.log(`Kling upload successful: ${klingUrl}`);
            
            // Generate video from uploaded image with prompt from CSV
            console.log('Starting video generation...');
            const videoResult = await generateVideoFromImage(klingUrl, prompt);
            
            return {
                success: true,
                message: 'Image uploaded and video generation started',
                klingUrl: klingUrl,
                videoTask: videoResult,
                token: token,
                httpEndpoints: httpEndpoints,
                filename: filename,
                timestamp: new Date().toISOString()
            };
        } else {
            throw new Error(`Verify failed: ${verifyResponse.data.message || 'Unknown error'}`);
        }
        
    } catch (error) {
        console.error('Upload image error:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
    }
}

// Upload CSV/Excel file and parse data
app.post('/api/upload-csv', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        const results = [];
        const filePath = req.file.path;

        // Parse CSV file
        fs.createReadStream(filePath)
            .pipe(csv({
                trim: true,
                skipEmptyLines: true
            }))
            .on('data', (data) => {
                console.log('CSV row data:', data); // Debug log
                if (data.prompt && data.image) {
                    results.push({
                        prompt: data.prompt.trim(),
                        image: data.image.trim()
                    });
                }
            })
            .on('end', async () => {
                // Clean up uploaded file
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }

                // Process each row to upload images
                const processedData = [];
                
                for (let i = 0; i < results.length; i++) {
                    const row = results[i];
                    console.log(`Processing item ${i + 1}/${results.length}: ${row.image}`);
                    
                    try {
                        const uploadResult = await uploadImageToKling(row.image, row.prompt);
                        processedData.push({
                            prompt: row.prompt,
                            originalImage: row.image,
                            klingImageUrl: uploadResult.klingUrl, // Use actual Kling URL
                            videoTask: uploadResult.videoTask, // Video generation task info
                            status: 'success',
                            uploadInfo: uploadResult
                        });
                        console.log(`✅ Success ${i + 1}/${results.length}: ${uploadResult.klingUrl}`);
                        console.log(`🎬 Video Task ID: ${uploadResult.videoTask.taskId}`);
                    } catch (error) {
                        console.error(`❌ Error ${i + 1}/${results.length}:`, error.message);
                        processedData.push({
                            prompt: row.prompt,
                            originalImage: row.image,
                            klingImageUrl: null,
                            videoTask: null,
                            status: 'failed',
                            error: error.message
                        });
                    }
                    
                    // Add delay between requests to avoid rate limiting
                    if (i < results.length - 1) {
                        console.log('Waiting 5 seconds before next upload...');
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }
                }

                res.json({
                    success: true,
                    data: processedData,
                    total: results.length,
                    successful: processedData.filter(item => item.status === 'success').length,
                    failed: processedData.filter(item => item.status === 'failed').length
                });
            })
            .on('error', (error) => {
                // Clean up uploaded file
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                
                res.status(500).json({
                    success: false,
                    error: 'Error parsing CSV file: ' + error.message
                });
            });
    } catch (error) {
        console.error('Upload CSV error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Kling Login API
app.post('/api/kling/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const loginUrl = 'https://id.klingai.com/pass/ksi18n/web/login/emailPassword';
        
        const response = await axios.post(loginUrl, {
            email: email,
            password: password
        }, {
            headers: {
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
            }
        });
        
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Set cookies API
app.post('/api/set-cookies', (req, res) => {
    try {
        const { cookies } = req.body;
        
        if (!cookies) {
            return res.status(400).json({
                success: false,
                error: 'Cookies are required'
            });
        }
        
        currentCookies = cookies;
        console.log('Cookies updated:', cookies.substring(0, 100) + '...');
        
        res.json({
            success: true,
            message: 'Cookies updated successfully',
            hasCookies: !!currentCookies
        });
    } catch (error) {
        console.error('Set cookies error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get cookies status API
app.get('/api/cookies-status', (req, res) => {
    res.json({
        success: true,
        hasCookies: !!currentCookies,
        cookiesLength: currentCookies ? currentCookies.length : 0
    });
});

// Kling update cookies API
app.post('/api/kling/update-cookies', (req, res) => {
    try {
        const { cookies } = req.body;
        if (!cookies) {
            return res.status(400).json({
                success: false,
                message: 'Cookies are required'
            });
        }
        
        currentCookies = cookies;
        console.log('✅ Cookies updated successfully');
        
        res.json({
            success: true,
            message: 'Cookies updated successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update cookies',
            error: error.message
        });
    }
});

// Kling cookies status API
app.get('/api/kling/cookies-status', (req, res) => {
    res.json({
        success: true,
        hasCookies: !!currentCookies,
        timestamp: new Date().toISOString()
    });
});

// Test upload single image with current cookies
app.post('/api/test-upload', async (req, res) => {
    try {
        const { imageUrl } = req.body;
        
        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }
        
        console.log('Testing upload with image:', imageUrl);
        
        // Test only the token generation part
        const timestamp = Date.now();
        const filename = `test_${timestamp}.jpg`;
        
        const cookiesToUse = currentCookies || 'did=web_1e1a96daaa302169a55f1f415e26e17a6df4; userId=37904718;';
        
        const tokenResponse = await axios.get('https://api-app-global.klingai.com/api/upload/issue/token', {
            params: { filename },
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en',
                'cache-control': 'no-cache',
                'origin': 'https://app.klingai.com',
                'pragma': 'no-cache',
                'priority': 'u=1, i',
                'referer': 'https://app.klingai.com/',
                'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'time-zone': 'Asia/Saigon',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
                'Cookie': cookiesToUse
            }
        });
        
        res.json({
            success: true,
            message: 'Token generation successful',
            token: tokenResponse.data.data.token,
            httpEndpoints: tokenResponse.data.data.httpEndpoints,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Upload test error:', error);
        res.status(500).json({
            success: false,
            message: 'Upload test failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Debug endpoint to test full upload process step by step
app.post('/api/debug-upload', async (req, res) => {
    try {
        const { imageUrl } = req.body;
        
        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }
        
        console.log('Debug upload with image:', imageUrl);
        
        // Step 1: Get token
        const timestamp = Date.now();
        const filename = `debug_${timestamp}.jpg`;
        const cookiesToUse = currentCookies || 'did=web_1e1a96daaa302169a55f1f415e26e17a6df4; userId=37904718;';
        
        console.log('Step 1: Getting token...');
        const tokenResponse = await axios.get('https://api-app-global.klingai.com/api/upload/issue/token', {
            params: { filename },
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en',
                'cache-control': 'no-cache',
                'origin': 'https://app.klingai.com',
                'pragma': 'no-cache',
                'priority': 'u=1, i',
                'referer': 'https://app.klingai.com/',
                'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'time-zone': 'Asia/Saigon',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
                'Cookie': cookiesToUse
            }
        });
        
        const token = tokenResponse.data.data.token;
        const httpEndpoints = tokenResponse.data.data.httpEndpoints;
        console.log('✅ Token obtained:', token.substring(0, 50) + '...');
        
        // Step 2: Download image
        console.log('Step 2: Downloading image...');
        const tempImagePath = `/tmp/debug_${timestamp}.jpg`;
        const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });
        fs.writeFileSync(tempImagePath, imageResponse.data);
        console.log('✅ Image downloaded to:', tempImagePath);
        
        // Step 3: Test verify token (this is where 401 usually happens)
        console.log('Step 3: Testing verify token...');
        try {
            const verifyResponse = await axios.get('https://api-app-global.klingai.com/api/upload/verify/token', {
                params: { token },
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'en',
                    'cache-control': 'no-cache',
                    'origin': 'https://app.klingai.com',
                    'pragma': 'no-cache',
                    'priority': 'u=1, i',
                    'referer': 'https://app.klingai.com/',
                    'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'time-zone': 'Asia/Saigon',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
                    'Cookie': cookiesToUse
                }
            });
            console.log('✅ Verify successful:', verifyResponse.data);
        } catch (verifyError) {
            console.log('❌ Verify failed:', verifyError.response?.status, verifyError.response?.data);
            throw verifyError;
        }
        
        // Clean up
        if (fs.existsSync(tempImagePath)) {
            fs.unlinkSync(tempImagePath);
        }
        
        res.json({
            success: true,
            message: 'Debug upload completed successfully',
            token: token.substring(0, 50) + '...',
            httpEndpoints: httpEndpoints,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Debug upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Debug upload failed',
            error: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            timestamp: new Date().toISOString()
        });
    }
});

// Check video task status API
app.get('/api/video-task/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        
        if (!taskId) {
            return res.status(400).json({
                success: false,
                error: 'Task ID is required'
            });
        }

        // Use dynamic cookies if available, otherwise fallback to hardcoded ones
        const cookiesToUse = currentCookies || 'did=web_1e1a96daaa302169a55f1f415e26e17a6df4; __risk_web_device_id=2619671d1740996067504651; KLING_LAST_ACCESS_REGION=global; _gcl_au=1.1.468414764.1754324670; _ga=GA1.1.719912853.1754324670; _clck=defdxu%7C2%7Cfy8%7C0%7C2042; userId=37904718; ksi18n.ai.portal_st=ChNrc2kxOG4uYWkucG9ydGFsLnN0EqABRlIQ9jqcURvoiHC6eIvmJqezdb_OmkVaJZ93FTnVXa_xUZjEPgdDhimA1qnZKxa-ENepmOQcK_sAxFAMqksGKXHg5h7HoQ9K3LOPh8JMlxzU8ZVjbqlnXZUIqbz5srgEcHwH8_dej-BLW0j1hgZl4xL-ado-qs8lsCF9Y8N_2tzU0gfO5T89qjpC4yelzfkeB8RsDfHHoYz8y7YRLwT-wxoS9ZUz3tcFLaUcdMJflnP7ahvOIiCFFASSbhc4crxwFEWhILW6WiWulEBW7gqB7lmUpPBCfigFMAE; ksi18n.ai.portal_ph=5a1d61e4637892da9e734f3478588035a168; _clsk=1dvx8am%7C1754452791039%7C3%7C1%7Cj.clarity.ms%2Fcollect; _uetsid=97169d40726c11f0825ced3e20476fab; _uetvid=d1939eb0b6c611efb5d48b5053d95a86; _ga_MWG30LDQKZ=GS2.1.s1754499900$o6$g1$t1754499923$j37$l0$h572507615; ak_bmsc=C624D6818F65F5FE8286677D4FEE6803~000000000000000000000000000000~YAAQT6s3F+tW+3iYAQAAi0ZYgBw46Ujfti3bZiVL+uHGu8Z5/8mk3CfqTUoc9GYnJoc4BaP/sG7oJsswdstpUIGHBYqhrcmD/5JIRZ+0ZnwA+t/BmJeIKRSwaoGpzAT2CM2lla8iD63teE9AiYii5hMpBHvOqvywxYpr80wd5sJl7XjHtsj8TydTZ7TYfI5vUWoc5TYgB53fRHQvMFB9f1zDPjrgDdoSW4hM3sDNwG63HaoSib4G/i5L64ms+EVmoTDSxZHk2of79zfgzhlP8QYM0Aef+wNJhdGfK0yiy4wg4mwSmXT/WG4iVaeUyy94qLe3a35+NPZTAz87AuISsK39QtHqIX0XM4rqSm+bswxr0pacxePJvHAL+xNYoRSFFhV2hShUvvapQxhY4DTuT5N4; bm_sv=2911014728270099EDE3909E51EC559A~YAAQT6s3FwdX+3iYAQAARFVYgBxn2hX70IJ7sCUiQpN2pzJSxF9wKgl4RArtVkGiVDaYbIuJzK6FDiaCk3xGac0lA53AgzWQfMuNz7T+wiQEM6VzH5BuEt67sMUiWfq/Ccl3IROUERRIV+sqfcu2cp20XhXHuvEat+y5nU2xFwMkHbnE4Yngd3uRpatHQUcViK94yXGP2CLGkonb5unxSgBVgC6Za21jrQm7emx2QuGOzpGS42jXB79LHosyZuSiaQ==~1';
        
        console.log(`Checking status for video task: ${taskId}`);
        
        // Use the new API endpoint for checking task status
        const statusResponse = await axios.get(`https://api-app-global.klingai.com/api/user/works/personal/feeds`, {
            params: {
                __NS_hxfalcon: 'HUDR_sFnX-FFuAW5VsfDNK0XOP6snthhLcvIxjxBz8_r61UvYFIc7AGaHwcmlb_Lw36QFxBn0Bj4EKN4Zb24e3VuXscYogNIA2VgtPQO2gCi43de2oR63LL1hZW0okM8dUmYrH6VQSB7Y7ZSTIxoF0X7LUSWUr1pXnbkf6P4o8SqzzdFR6IIMKBvrgRoI4U6ivRMLenA12ccSYtqthj98PYKQiYknD1oZrTCqdIYEmeA9-IuKDb4BYMfFM-MucEeNCEqAxDTqGvp2l2yBnI1dPXhcb8ALexSfjrMThA63z04WXT8QydCeK4DY-9Ot16rLKD2TyqGUQehcBaHRADTnYXMRvwPwfoqemre0RYp-v8MxO863TNOkvgQ8CzC00yZUokllTsCpQ8Vbp9IxETkk-sSoZn-kx-jt2r2r9O3E2a6GMNA1fa0UKFhD3yPCv1vFZ-fozcJoiaWhxYRkEndun9W2qIA30CyFhRP2tqWMt-q_DhLBvJgj4OcqKH6D4RKgjeQPMc3sVZyCdTcl_lqE-S2gIWlcz7ZAZpyIynEXWpiMFc4kkmFzSoNTHUWPKziCgKtqoS6WKid0FhHymNVR-r1eWGZ-GNkg4SpR7JEhPTWSGRbBQrnRZI0slaexL-K_LA6oArX1SZ5UOG6AFSUSMqfMcuV1dQx_IyXTtPeoSONioGJFuewOeBDX5uuUznwE56xBHf1dK2QM4CLZM7WbLqy5_RkOTEeLpD2-KRU.$HE_031c84e1e3239bcdcad049b8d949bdd0be494848484969d0e4f20e923faa00cd8402d049d31e7692331e76a048',
                caver: '2',
                pageSize: '1',
                contentType: '',
                favored: 'false',
                taskId: taskId,
                extra: 'BASE_WORK'
            },
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en',
                'cache-control': 'no-cache',
                'origin': 'https://app.klingai.com',
                'pragma': 'no-cache',
                'priority': 'u=1, i',
                'referer': 'https://app.klingai.com/',
                'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'time-zone': 'Asia/Saigon',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
                'Cookie': cookiesToUse
            },
            timeout: 30000
        });
        
        console.log('Task status response:', JSON.stringify(statusResponse.data, null, 2));
        
        res.json({
            success: true,
            data: statusResponse.data
        });
    } catch (error) {
        console.error('Check video task status error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Export for Vercel
module.exports = app; 