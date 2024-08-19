import { NextResponse } from "next/server";

export default function POST(){
    return NextResponse.json({
        msg : "checkout route working fine"
    })
}