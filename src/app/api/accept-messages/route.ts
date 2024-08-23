import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user as User

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    }
    const userId = user._id;
    const { accpetMessages } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: accpetMessages }, { new: true });
        if (!updatedUser) {
            return Response.json({ success: false, message: "failed to update user status to accept messages" }, { status: 401 });
        }
        return Response.json({ success: true, message: "Message acceptance status updated successfully", updatedUser }, { status: 200 });

    } catch (error: any) {
        console.log("failed to update user status to accept")
        return Response.json({ success: false, message: error.message }, { status: 500 });
    }

}
export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as User

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    }

    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }
        return Response.json({ success: true, isAcceptingMessage: foundUser.isAcceptingMessage }, { status: 200 });

    } catch (error: any) {
        console.log("Error in getting message acceptane messages")
        return Response.json({ success: false, message: error.message }, { status: 500 });

    }

}