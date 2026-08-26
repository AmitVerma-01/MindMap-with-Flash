import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(){
    return NextResponse.json({
        msg : "checkout route working fine"
    })
}