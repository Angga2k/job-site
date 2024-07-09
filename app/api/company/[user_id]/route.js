import {NextResponse} from "next/server";
import prisma from "@/prisma/client";

export async function GET(request, {params})
{
    const user_id = parseInt(params.user_id)

    const company = await prisma.company.findFirst({
        where: {
            user_id,
        },
    })

    if (!company) {
        return NextResponse.json({
            success: false,
            message: "Your Company not found",
            data: null,
        })
    }

    return NextResponse.json({
        success: true,
        message: "Your Company has been successfully retrieved",
        data: company,
    })
}

export async function PATCH(request, {params})
{
    
}