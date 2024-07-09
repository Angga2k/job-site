
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";


export async function GET (request, {params})
{
    const category_id = parseInt(params.category_id);

    const category = await prisma.jobCategory.findUnique({
        where : {
            category_id,
        },
    });

    if(!category)
    {
        return NextResponse.json({
            success : true,
            message : "Job Category not found",
            data : null,
        },{
            status : 404,
        })
    }

    return NextResponse.json({
        success : true,
        message : "Job Category found",
        data : category,
    },{
        status : 200,
    })

}