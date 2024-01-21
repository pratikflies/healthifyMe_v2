exports.getError = (req, res, next) => {
  return res.status(404).render("404");
};
