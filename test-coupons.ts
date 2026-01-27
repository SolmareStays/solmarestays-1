
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const API_URL = process.env.VITE_HOSTAWAY_API_URL || 'https://api.hostaway.com/v1';
const API_TOKEN = process.env.VITE_HOSTAWAY_API_TOKEN;

async function testFetchCoupons() {
  if (!API_TOKEN) {
    console.error('API_TOKEN is missing');
    return;
  }

  try {
    console.log('Fetching coupons...');
    const response = await fetch(`${API_URL}/coupons`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Cache-control': 'no-cache',
      },
    });

    if (!response.ok) {
      console.log(`Failed to fetch coupons: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.log('Error body:', text);
      return;
    }

    const data = await response.json();
    console.log('Coupons response:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

testFetchCoupons();
