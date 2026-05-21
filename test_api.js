const axios = require('axios');
async function test() {
  try {
    const res = await axios.get('http://127.0.0.1:3002/api/product/get-all');
    console.log(JSON.stringify(res.data.data.slice(0, 2), null, 2));
  } catch(e) {
    console.log(e.message);
  }
}
test();
