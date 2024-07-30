const User = require("../models/user");
exports.updateUser = async (req, res, next) => {
    if (req.user.userId != req.params.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedData = {
            isd_code: req.body.isd_code,
            phone_number: req.body.phone_number,
            profilePicture: req.body.profilePicture,
            sex: req.body.sex
        };

        await user.update(updatedData);

        return res.status(200).json({
            message: "User updated successfully",
            user
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res, next) => {
    if (req.user.userId != req.params.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
