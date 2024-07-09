import {NextResponse} from "next/server";
import prisma from "@/prisma/client";

import {z} from "zod";

const companySchema = z.object({
    user_id: z.number().int().positive(),
    company_name: z.string().min(1, "Company name is required"),
    description: z.string().optional(),
    website: z.string().url().optional(),
    location: z.string().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

export async function GET() {
    try {
        const company = await prisma.company.findMany();

        if (company.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Company not found",
                data: null,
            }, {
                status: 404,
            });
        }
        else
        {
            return NextResponse.json({
                success: true,
                message: "List Data Company",
                data: company,
            }, {
                status: 200,
            });
        }
    }
    catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
            data: null,
        }, {
            status: 500,
        });
    }
}

export async function POST(request)
{
    const data = await request.json();
    const validation = companySchema.safeParse(data);

    if (!validation.success)
    {
        return NextResponse.json({
            success: false,
            message: validation.error.issues,
            errors: validation.error.errors,
        }, {
            status: 400,
        });
    }

    try
    {
        const company = await prisma.company.create({
            data:{
                user_id: data.user_id,
                company_name: data.company_name,
                description: data.description,
                website: data.website,
                location: data.location,
            }
        });

        return NextResponse.json({
            success: true,
            message: "Company created",
            data: company,
        })
    }
    catch (error)
    {
        return NextResponse.json({
            success: false,
            message: error.message,
            data: null,
        }, {
            status: 500,
        });
    }
}