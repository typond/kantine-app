#!/usr/bin/env node

/**
 * Test script for the Restaurant Menu Scraper
 * Usage: node test-scraper.js [restaurant-url]
 */

const axios = require('axios');

const SERVER_URL = 'http://localhost:3001';
const TEST_URLS = [
    'https://www.mcdonalds.com/us/en-us/about-us/our-food.html',
    'https://www.pizzahut.com/',
    'https://www.subway.com/en-us/menu',
    'https://www.kfc.com/menu'
];

async function testHealthCheck() {
    try {
        console.log('🏥 Testing health check...');
        const response = await axios.get(`${SERVER_URL}/api/health`, { timeout: 5000 });
        console.log('✅ Health check passed:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        return false;
    }
}

async function testRestaurantScraping(url) {
    try {
        console.log(`🍽️ Testing restaurant scraping for: ${url}`);
        
        const response = await axios.post(`${SERVER_URL}/api/scrape-restaurant`, {
            url: url
        }, {
            timeout: 120000, // 2 minutes
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = response.data;
        
        if (result.success) {
            console.log('✅ Scraping successful!');
            console.log(`📋 Found ${result.menuItems.length} menu items:`);
            result.menuItems.slice(0, 5).forEach((item, index) => {
                console.log(`   ${index + 1}. ${typeof item === 'string' ? item : item.name || JSON.stringify(item)}`);
            });
            if (result.menuItems.length > 5) {
                console.log(`   ... and ${result.menuItems.length - 5} more items`);
            }
        } else {
            console.log('❌ Scraping failed:', result.error);
            if (result.steps) {
                console.log('📝 Steps taken:');
                result.steps.forEach((step, index) => {
                    console.log(`   ${index + 1}. ${step.step}`);
                });
            }
        }
        
        return result;
    } catch (error) {
        console.error('❌ Scraping test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        return null;
    }
}

async function testInvalidInput() {
    try {
        console.log('🧪 Testing invalid input handling...');
        
        // Test missing URL
        try {
            await axios.post(`${SERVER_URL}/api/scrape-restaurant`, {}, { timeout: 5000 });
            console.log('❌ Should have failed with missing URL');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Correctly rejected missing URL');
            } else {
                console.log('❌ Unexpected error for missing URL:', error.message);
            }
        }
        
        // Test invalid URL
        try {
            await axios.post(`${SERVER_URL}/api/scrape-restaurant`, {
                url: 'not-a-url'
            }, { timeout: 5000 });
            console.log('❌ Should have failed with invalid URL');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Correctly rejected invalid URL');
            } else {
                console.log('❌ Unexpected error for invalid URL:', error.message);
            }
        }
        
    } catch (error) {
        console.error('❌ Invalid input test failed:', error.message);
    }
}

async function runTests() {
    console.log('🚀 Starting Restaurant Scraper Tests...\n');
    
    // Test 1: Health check
    const isHealthy = await testHealthCheck();
    if (!isHealthy) {
        console.log('\n❌ Server is not running. Please start it with: npm start');
        process.exit(1);
    }
    console.log('');
    
    // Test 2: Invalid input handling
    await testInvalidInput();
    console.log('');
    
    // Test 3: Restaurant scraping
    const testUrl = process.argv[2] || TEST_URLS[0];
    const result = await testRestaurantScraping(testUrl);
    
    console.log('\n📊 Test Summary:');
    console.log(`   Server Health: ${isHealthy ? '✅' : '❌'}`);
    console.log(`   Scraping Test: ${result?.success ? '✅' : '❌'}`);
    console.log(`   Menu Items Found: ${result?.menuItems?.length || 0}`);
    
    if (result?.steps) {
        console.log(`   Steps Taken: ${result.steps.length}`);
    }
    
    console.log('\n🏁 Tests completed!');
}

// Handle command line usage
if (require.main === module) {
    runTests().catch(error => {
        console.error('❌ Test suite failed:', error);
        process.exit(1);
    });
}

module.exports = {
    testHealthCheck,
    testRestaurantScraping,
    testInvalidInput,
    runTests
};

