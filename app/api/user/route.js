//import next request and response
import {
    NextResponse
} from "next/server";

//import prisma client
import prisma from "@/prisma/client";

import {
    z
} from "zod";

const userSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.string().email("Invalid email address"),
    full_name: z.string().optional(),
    phone_number: z.string().optional(),
    user_type: z.enum(["job_seeker", "employer"]),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
})

export async function GET() {
    try {

        //get all posts
        const users = await prisma.user.findMany();

        if (users.length === 0) {
            return NextResponse.json({
                sucess: false,
                message: "Users not found",
                data: null,
            }, {
                status: 404,
            })
        } else {
            return NextResponse.json({
                sucess: true,
                message: "List Data Users",
                data: users,
            }, {
                status: 200,
            });
        }
    } catch (error) {
        return NextResponse.json({
            sucess: false,
            message: error.message,
            data: null,
        })
    }
}

export async function POST(request) {
    const data = await request.json();
    const validation = userSchema.safeParse(data);
    if (!validation.success) {
        return NextResponse.json({
            sucess: false,
            message: validation.error.issues,
            errors: validation.error.errors,
            data: null,
        })
    }

    try {

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{
                        username: data.username
                    },
                    {
                        email: data.email
                    }
                ]
            },
            select: {
                username: true,
                email: true
            }
        })

        const errors = {};
        if (existingUser) {
            if (existingUser.username === data.username) {
                errors.username = "Username already exists"
            }

            if (existingUser.email === data.email) {
                errors.email = "Email already exists"
            }
            return NextResponse.json({
                success: false,
                message: "Validation failed",
                errors: errors,
                data: null,
            }, {
                status: 409,
            });
        }

        const user = await prisma.user.create({
            data: {
                username: data.username,
                password: data.password,
                email: data.email,
                full_name: data.full_name,
                phone_number: data.phone_number,
                user_type: data.user_type,
            },
        });

        return NextResponse.json({
            success: true,
            message: "User created successfully",
            data: user,
        }, {
            status: 201,
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
            data: null,
        }, {
            status: 500,
        });
    }
}