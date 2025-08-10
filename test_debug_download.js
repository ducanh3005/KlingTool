const axios = require('axios');

async function testDebugDownload() {
    try {
        console.log('🔍 Testing debug download API...\n');
        
        const workId = '286793555538451';
        
        console.log(`📋 Work ID: ${workId}\n`);
        
        // Test debug endpoint
        console.log('🔄 Testing debug endpoint...');
        const debugResponse = await axios.post('http://localhost:3000/api/debug-download', {
            workId: workId
        });
        
        console.log('✅ Debug Response:');
        console.log(JSON.stringify(debugResponse.data, null, 2));
        
        // Test actual download endpoint
        console.log('\n🔄 Testing actual download endpoint...');
        const downloadResponse = await axios.post('http://localhost:3000/api/download-no-watermark', {
            workId: workId
        });
        
        console.log('✅ Download Response:');
        console.log(JSON.stringify(downloadResponse.data, null, 2));
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Run test
testDebugDownload();
