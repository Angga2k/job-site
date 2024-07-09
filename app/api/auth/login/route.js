import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request)
{
    const {email, password} = await request.json();

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user)
    {
        return NextResponse.json({
            success: false,
            message: "User not found",
            data: null,
        },{
            status: 404,
        })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if(!isValidPassword)
    {
        return NextResponse.json({
            success: false,
            message: "Invalid password",
            data: null,
        },{
            status: 401,
        })
    }

    const token = jwt.sign({userId : user.user_id}, JWT_SECRET, {expiresIn: '1h'})

    return NextResponse.json({
        success: true,
        message: "Login successful",
        data: {
            token,
        },
    });
}