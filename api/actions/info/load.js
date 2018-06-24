export default function load() {
  return new Promise(resolve => {
    console.log('>>>>>>>>>>>>>> Api > Actions > Info > load <<<<<<<<<<<<<<<<<');
    resolve({
      message: 'This came from the api server',
      time: Date.now()
    });
  });
}
