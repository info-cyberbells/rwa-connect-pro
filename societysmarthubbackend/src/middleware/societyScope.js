// Use on endpoints that modify society-scoped resources.
export function ensureSameSociety(paramSocietyIdPath = "body.society") {
  return (req, res, next) => {
    const reqSociety = req.user.society; // from token
    const targetSociety = req.body.society || req.params.societyId || null;
    // superadmin/society_admin (global) can pass society null and manage any society in separate endpoint (they must be permitted)
    if (req.user.role === "superadmin" || req.user.role === "society_admin") return next();
    if (!reqSociety) return res.status(403).json({ message: "No society assigned" });
    if (String(reqSociety) !== String(targetSociety)) return res.status(403).json({ message: "Forbidden: different society" });
    next();
  };
}
