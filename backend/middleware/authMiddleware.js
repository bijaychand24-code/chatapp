export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({message: "Unauthorized: NO token found !"});

    }
    const decoded = jwt.varify(token, process.env.JWT_SECRET);
    const user = await user.findBtId(decoded._id);
    req.user = user;
    next();
}catch(error) {
    return res.status(401).json({message: "Unauthorized: Invalid token!"});
        
};
