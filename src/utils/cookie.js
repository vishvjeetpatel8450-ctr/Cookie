const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie("token");
};

module.exports = {
  setAuthCookie,
  clearAuthCookie
};
