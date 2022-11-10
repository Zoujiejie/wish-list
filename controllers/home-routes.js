const router = require("express").Router();
const { Registry, User, Category, Product } = require("../models");

router.get("/", async (req, res) => {
  /* get list of registries */
  try {
    const registryData = await Registry.findAll({
      include: { model: User, attributes: ["username"] },
    });

    const registries = registryData.map((registry) =>
      registry.get({ plain: true })
    );
    if (registries) {
      /* render homepage with list */
      res.render("homepage", { registries, loggedIn: req.session.loggedIn });
    } else {
      res.status(404).json({ success: false, message: "No registries found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/dashboard", async (req, res) => {
  if (!req.session.loggedIn) {
    res.render("login");
  } else {
    const registryData = await Registry.findAll({
      where: {
        user_id: req.session.userId,
      },
    });

    const registries = registryData.map((registry) =>
      registry.get({ plain: true })
    );
    res.render("dashboard", {
      registries: registries,
      loggedIn: req.session.loggedIn,
    });
  }
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("dashboard");
    return;
  }
  res.render("login");
});

router.get("/registry", (req, res) => {
  res.render("registry", {
    loggedIn: req.session.loggedIn,
  });
});
module.exports = router;

router.get("/registry/:id", (req, res) => {
  res.render("new-registry", {
    loggedIn: req.session.loggedIn,
  });
});
