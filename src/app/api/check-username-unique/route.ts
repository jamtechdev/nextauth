import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
});


export async function GET(request: Request) {
    await dbConnect();
    // localhost:3000/api/CheckUsernameUnique?username=hello
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        }
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result) //TODO REMOVE
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({ success: false, message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid username" }, { status: 400 });
        }
        console.log(result.data)
        const { username } = result.data;

        const exisitingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if (exisitingVerifiedUser) {
            return Response.json({ success: false, message: "Username already taken" }, { status: 400 });

        }

        return Response.json({ success: true, message: "Username available" }, { status: 200 });




    } catch (error: any) {
        console.error("Error while checking username", error);
        return Response.json({ success: false, message: error.message }, { status: 500 });

    }
}

// export async function POST(request: Request) {
//     await dbConnect();
//     try {
//         const { username } = await request.json();
//         const user = await UserModel.findOne({ username });
//         if (user) {
//             return Response.json({ success: false, message: "Username already taken" }, { status: 400 });
//         }
//         return Response.json({ success: true, message: "Username available" }, { status: 200 });
//     } catch (error: any) {
//         return Response.json({ success: false, message: error.message }, { status: 500 });
//     }
// }
