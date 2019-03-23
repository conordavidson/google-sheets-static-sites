module.exports = req =>
  new Promise((resolve, reject) => {
    return resolve(req.body.site);
  });
