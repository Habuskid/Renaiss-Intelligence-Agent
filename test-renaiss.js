import { searchCards } from './src/services/renaiss.js';

searchCards("charizard")
  .then(res => {
    console.log("Found", res.length, "results for charizard");
    if (res.length > 0) {
      console.log("First result:", JSON.stringify(res[0], null, 2));
    }
  })
  .catch(err => console.error(err));
