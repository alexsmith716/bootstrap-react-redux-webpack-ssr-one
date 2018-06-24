
console.log('>>>>>>>>>>>>>>>>>>>>> TESTING NODE LOAD PROCESS 3 !!!!!! <<<<<<<<<<<<<<<<<<<<');


export default function testingNodeLoadProcess3(req, res, next) {

  console.log('>>>>>>>>>>>>>>>>>>>>> TESTING NODE LOAD PROCESS 33 ! < req.url: ', req.url);

  return next();

};