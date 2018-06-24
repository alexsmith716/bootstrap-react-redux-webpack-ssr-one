
console.log('>>>>>>>>>>>>>>>>>>>>> TESTING NODE LOAD PROCESS 4 !!!!!! <<<<<<<<<<<<<<<<<<<<');


export default function testingNodeLoadProcess3(app) {

  console.log('>>>>>>>>>>>>>>>>>>>>> TESTING NODE LOAD PROCESS 44 !!!!!! <<<<<<<<<<<<<<<<<<<<');

  app.use((req, res, next) => {
    console.log('>>>>>>>>>>>>>>>>>>>>> TESTING NODE LOAD PROCESS 444 ! < req.url: ', req.url);
    return next();
  });

  return (req, res, next) => {
    return next();
  }

};
