const axios = require('axios');

async function testVideoGeneration() {
    try {
        console.log('🎬 Testing Video Generation...\n');
        
        // Test image URL (use the one we successfully uploaded before)
        const testImageUrl = 'https://s15-kling.klingai.com/kimg/EMXN1y8qSQoGdXBsb2FkEg55bGFiLXN0dW50LXNncBovYWlfcG9ydGFsLzE3NTQ1MzQ5NzYvNDdZZ3NwT0ZKeC9mcmFtZV80X18xXy5wbmc.origin?x-kcdn-pid=112372';
        
        console.log(`📸 Using test image: ${testImageUrl}\n`);
        
        // Test 1: Generate video with default prompt
        console.log('🔄 Test 1: Generate video with default prompt...');
        const response1 = await axios.post('http://localhost:3000/api/generate-video', {
            imageUrl: testImageUrl
        });
        
        console.log('✅ Test 1 Result:');
        console.log(JSON.stringify(response1.data, null, 2));
        
        if (response1.data.success && response1.data.data.videoTask) {
            const taskId = response1.data.data.videoTask.taskId;
            console.log(`\n🎯 Video Task ID: ${taskId}`);
            
            // Test 2: Check task status
            console.log('\n🔄 Test 2: Check video task status...');
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            
            const response2 = await axios.get(`http://localhost:3000/api/video-task/${taskId}`);
            
            console.log('✅ Test 2 Result:');
            console.log(JSON.stringify(response2.data, null, 2));
        }
        
        // Test 3: Generate video with custom prompt
        console.log('\n🔄 Test 3: Generate video with custom prompt...');
        const customPrompt = "A beautiful woman with flowing hair in a magical forest, with sparkles and light effects, cinematic camera movement";
        
        const response3 = await axios.post('http://localhost:3000/api/generate-video', {
            imageUrl: testImageUrl,
            prompt: customPrompt
        });
        
        console.log('✅ Test 3 Result:');
        console.log(JSON.stringify(response3.data, null, 2));
        
        console.log('\n🎉 All video generation tests completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run the test
testVideoGeneration(); 