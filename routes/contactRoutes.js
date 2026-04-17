import express from "express";
import contactControllers from "../controllers/contactControllers.js";
import validateToken from "../middleware/validateToken.js";
const router = express.Router();

router.use(validateToken);
router.get("/", contactControllers.allContacts);
router.get("/:id", contactControllers.showContact);
router.post("/", contactControllers.addContact);
router.put("/:id", contactControllers.updateContact);
router.delete("/:id", contactControllers.deleteContact);

export default router;