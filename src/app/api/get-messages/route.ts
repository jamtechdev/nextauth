import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user = session?.user as User

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

    }
    const userId = new mongoose.Types.ObjectId(_user._id);
    try {
        // aggreagate pipeline
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } },
            { $limit: 10 }]);

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "No messages found"
            }, { status: 401 })
        }
        return Response.json({ success: true, messages: user[0].messages }, { status: 200 })
    } catch (error) {

    }




}