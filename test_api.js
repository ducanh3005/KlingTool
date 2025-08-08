const axios = require('axios');

// Test configuration
const API_BASE_URL = 'https://kling-tool.vercel.app';

async function testAPI() {
    console.log('🧪 Testing Kling Tool API...\n');

    // Test 1: Check if the API is accessible
    console.log('1️⃣ Testing basic connectivity...');
    try {
        const testResponse = await axios.get(`${API_BASE_URL}/api/test`);
        console.log('✅ Test endpoint working:', testResponse.data);
    } catch (error) {
        console.log('❌ Test endpoint failed:', error.response?.data || error.message);
        return;
    }

    // Test 2: Test login endpoint with OPTIONS (preflight)
    console.log('\n2️⃣ Testing OPTIONS request...');
    try {
        const optionsResponse = await axios.options(`${API_BASE_URL}/api/kling/login`);
        console.log('✅ OPTIONS request successful:', optionsResponse.status);
    } catch (error) {
        console.log('❌ OPTIONS request failed:', error.response?.data || error.message);
    }

    // Test 3: Test login endpoint with POST
    console.log('\n3️⃣ Testing POST request...');
    try {
        const loginData = {
            email: "test@example.com",
            password: "testpassword"
        };

        const loginResponse = await axios.post(`${API_BASE_URL}/api/kling/login`, loginData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            },
            timeout: 30000
        });

        console.log('✅ Login endpoint working:', loginResponse.data);
    } catch (error) {
        console.log('❌ Login endpoint failed:');
        console.log('   Status:', error.response?.status);
        console.log('   Status Text:', error.response?.statusText);
        console.log('   Data:', error.response?.data);
        console.log('   Message:', error.message);
    }

    // Test 4: Test with curl equivalent
    console.log('\n4️⃣ Testing with curl equivalent...');
    try {
        const curlData = {
            email: "RaisinOyabu13041982kn@hotmail.com",
            password: "Lala123@"
        };

        const curlResponse = await axios.post(`${API_BASE_URL}/api/kling/login`, curlData, {
            headers: {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                'origin': 'https://kling-tool.vercel.app',
                'pragma': 'no-cache',
                'priority': 'u=1, i',
                'referer': 'https://kling-tool.vercel.app/',
                'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Microsoft Edge";v="138"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0'
            },
            timeout: 30000
        });

        console.log('✅ Curl equivalent working:', curlResponse.data);
    } catch (error) {
        console.log('❌ Curl equivalent failed:');
        console.log('   Status:', error.response?.status);
        console.log('   Status Text:', error.response?.statusText);
        console.log('   Data:', error.response?.data);
        console.log('   Message:', error.message);
    }

    console.log('\n🏁 Testing completed!');
}

// Run the test
testAPI().catch(console.error); 