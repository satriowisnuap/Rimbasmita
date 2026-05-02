import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rimbasmita@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});
