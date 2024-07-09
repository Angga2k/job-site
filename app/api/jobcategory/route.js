import {
    NextResponse
} from "next/server";

//import prisma client
import prisma from "@/prisma/client";

export async function GET() {
    try {
        const jobcategory = await prisma.jobCategory.findMany();

        if (jobcategory.length === 0) {
            return NextResponse.json({
                success: false,
                message: "JobCategory not found",
                data: null,
            }, {
                status: 404,
            })
        } else {
            return NextResponse.json({
                success: true,
                message: "List Data JobCategory",
                data: jobcategory,
            }, {
                status: 200,
            })
        }
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