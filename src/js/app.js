import '@/vars'; // global vars 

console.log('Check import functions:', $("h1").textContent); 

const testAsync =  async () => console.log('Check async funtions: Ok')

try {
   console.log('Check babel job:', testAsync);
} catch (error) {
      console.log('Error', error);
}




