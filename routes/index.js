
exports.index = function (req, res) {
  res.render("index");
};

exports.resource = function (req, res) {
  res.send({
    code: 201,
    url: 'https://chengzc.club',
    size: '320kb',
    version: '1.0.1'
  });
};