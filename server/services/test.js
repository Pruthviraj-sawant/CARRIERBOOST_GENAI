const { generateJavaQuestion } = require('./videostreamservvice');

(async () => {
  try {
    const question = await generateJavaQuestion('advanced'); // options: easy, intermediate, advanced, legendary
    console.log('Java Interview Question:', question);
  } catch (error) {
    console.error(error.message);
  }
})();
