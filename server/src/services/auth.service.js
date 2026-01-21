import User from '../../models/User.js';

export const registerUser = async (email, password) => {
    if (!email || !password) throw new Error('Missing fields');

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('User already exists');

    const newUser = new User({ email, password });
    await newUser.save();
    return newUser;
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
    }
    return user;
};
