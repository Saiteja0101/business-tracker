import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    (await cookies()).delete("token"); // clear the cookie
    return NextResponse.json({ message: "Logged out" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to logout" },
      { status: 500 }
    );
  }
}
