const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Seller = require("../models/Seller");
const cloudinary = require("../utils/cloudinary");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role, location } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Upload profile picture (only 1 file expected)
    let profilePictureUrl = "";
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(
        [req.file],
        "profile-pictures"
      );
      profilePictureUrl = uploadedImage[0]?.url || "";
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role: role || "user",
      profilePicture: profilePictureUrl,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(location.longitude),
          parseFloat(location.latitude),
        ],
      },
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("User registration error:", err);
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// Register a new seller

// Login for both users and sellers
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await Seller.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "No account found with this email" });
      }
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token as HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // only over HTTPS in production
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      role: user.role,
      status: user.status,
      userId: user._id,
      name: user.name,
      email: user.email,
      location: user?.location,
      businessName: user?.businessName,
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user account found with this email" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User login successful",
      role: user.role,
      userId: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error logging in user", error: err.message });
  }
};

const sellerLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res
        .status(404)
        .json({ message: "No seller account found with this email" });
    }

    const isMatch = await seller.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: seller._id, role: seller.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Seller login successful",
      role: seller.role,
      status: seller.status,
      userId: seller._id,
      name: seller.name,
      email: seller.email,
      location: seller.location,
      businessName: seller.businessName,
      profilePicture: seller.profilePicture,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error logging in seller", error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    // Retrieve user information from the decoded JWT (req.user)
    const userId = req.user.userId;
    const role = req.user.role;

    if (role === "user") {
      const user = await User.findById(userId); // Assuming userId corresponds to seller's document ID
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({
        userId,
        role,
        profilePicture: user.profilePicture, // Include profile picture if available
        name: user.name,
        email: user.email,
        location: user.location,
        // Send the seller status (approved/pending)
        message: "Authenticated",
      });
    }
    // If the user is a seller, fetch additional seller status
    if (role === "seller") {
      const seller = await Seller.findById(userId); // Assuming userId corresponds to seller's document ID
      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }

      // Send back the seller status along with other user details
      return res.status(200).json({
        userId,
        role,
        profilePicture: seller.profilePicture, // Include profile picture if available
        status: seller.status,
        name: seller.name,
        email: seller.email,
        location: seller.location,
        businessName: seller.businessName, // Send the seller status (approved/pending)
        message: "Authenticated",
      });
    }

    // If the user is not a seller, just return basic info (you can extend this for other roles)
    res.status(200).json({
      userId,
      role,
      message: "Authenticated",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve user profile", error: err.message });
  }
};

// Logout: Clear cookie
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  login,
  logout,
  getUserProfile,
  userLogin,
  sellerLogin,
};
