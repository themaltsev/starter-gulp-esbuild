import '@/vars'; // global vars 

console.log(`Check $("h1"): ${ $("h1").textContent }`)

const testAsync = async () => 'Async WORK'

const var_test = await testAsync()

try {
   
   console.log(`Check babel: ${var_test}`);
} catch (error) {
      console.log('Error', error);
}







