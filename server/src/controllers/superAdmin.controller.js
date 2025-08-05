import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const dummyUser = {
  email: "admin@example.com",
  passwordHash: bcrypt.hashSync("admin123", 10) 
}

export const login = (req, res) => {
  const { email, password } = req.body

  if (email !== dummyUser.email) {
    return res.status(401).json({ message: "Invalid email or password" })
  }

  const isMatch = bcrypt.compareSync(password, dummyUser.passwordHash)
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" })
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" })

  res.json({ token })
}