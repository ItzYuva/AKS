import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface ContactRequestBody {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json() as ContactRequestBody;

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Configure the SMTP transport for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configure the actual email layout that you will receive in your inbox
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'adityauv11@gmail.com',
      replyTo: email, // Extremely helpful so that clicking "Reply" responds straight to the user
      subject: `[Portfolio Contacts] New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    // Send it!
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Nodemailer Contact Errored:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
} 