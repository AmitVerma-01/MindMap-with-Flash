import { NextResponse } from "next/server";

export async function POST(){
    return NextResponse.json({
        msg : "checkout route working fine"
    })
}