import {
    NextResponse
} from "next/server";

import prisma from "@/prisma/client";

import {
    z
} from "zod";

const userSchema = z.object({
    username: z.string().min(1, "Username is required").optional(),
    password: z.string().min(6, "Password must be at least 6 characters long").optional(),
    email: z.string().email("Invalid email address").optional(),
    full_name: z.string().optional(),
    phone_number: z.string().optional(),
    user_type: z.enum(["job_seeker", "employer"]).optional(),
});

export async function GET(request, {params}) {
    const user_id = parseInt(params.user_id)

    const user = await prisma.user.findUnique({
        where: {
            user_id,
        },
    });

    if (!user) {
        return NextResponse.json({
            success: true,
            message: "User not found",
            data: null
        }, {
            status: 404,
        })
    }

    return NextResponse.json({
        success: true,
        message: "User found",
        data: user
    }, {
        status: 200,
    })
}

export async function PATCH(request, {
    params
}) {
    const user_id = parseInt(params.user_id)

    const data = await request.json()
    const validation = userSchema.safeParse(data)
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

        const user = await prisma.user.update({
            where: {
                user_id,
            },
            data: {
                username: data.username,
                email: data.email,
                full_name: data.full_name,
                phone_number: data.phone_number,
                user_type: data.user_type,
                updated_at: new Date(),
            },
        });
        return NextResponse.json({
            success: true,
            message: "User updated",
            data: user,
        }, {
            status: 200,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
            data: null,
        }, {
            status: 500,
        })
    }
}

export async function DELETE(request, {
    params
}) {
    const user_id = parseInt(params.user_id)

    try {
        const check_user = await prisma.user.findUnique({
            where: {
                user_id,
            },
        });
        if (!check_user) {
            return NextResponse.json({
                success: true,
                message: "User not found",
                data: null
            }, {
                status: 404,
            })
        }

        const user = await prisma.user.delete({
            where: {
                user_id,
            },
        });
        return NextResponse.json({
            success: true,
            message: "User deleted",
            data: user,
        }, {
            status: 200,
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