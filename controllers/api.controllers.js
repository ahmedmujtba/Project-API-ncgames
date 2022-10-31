exports.getApi = (req, res, next) => {
  console.log(api);
  res.status(200).send(api);
};
