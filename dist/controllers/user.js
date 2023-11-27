import { User } from "../entities/user.js";
function createUser(req, res) {
    const { name, email, password } = req.body;
    const user = new User(name, email, password);
    res.json(user);
}
export { createUser };
//# sourceMappingURL=user.js.map