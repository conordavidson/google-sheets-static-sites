module.exports = (siteData, res) =>
  new Promise((resolve, reject) => {
    return res.render("index", siteData);
    resolve();
    // res.render("index", siteData, (err, html) => {
    //   if (err) reject(err);
    //   resolve(html);
    // });
  });
