"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  createAndStoreAuthSession,
  deactivateSessionFromToken,
  hashingPassword,
  verifyAccessSession,
} from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function registerUser(formData) {
  let success = false;

  //  console.log(SECRET_KEY);

  try {
    await dbConnect();

    const cookieStore = await cookies();

    const { username, email, password } = formData;
    const userID = uuidv4();

    console.log("userID: ", userID);
    /*     
      console.log(formData);
      console.log("username:", username);
      console.log("email:", email);
      console.log("password:", password); 
    */

    const hashedPassword = await hashingPassword(password);

    //    const hashedPassword = await bcrypt.hash(password, 10);

    /*     console.log("hashedPassword:", hashedPassword);
     */

    const userExists = await User.findOne({ email });

    if (userExists) {
      return {
        success: false,
        status: 401,
        error: "User Already Exists.",
      };
    }

    const newUser = new User({
      _id: userID,
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    await createAndStoreAuthSession(cookieStore, userID);

    revalidatePath("/dashboard");
    success = true;
  } catch (error) {
    console.error("Registration Error: ", error);
    return {
      success: false,
      error: "Internal Server Error.",
    };
  }

  if (success) {
    //    redirect("/dashboard");
    return {
      success: true,
      status: 200,
      message: "Successfully Registered... Redirecting To Dashboard",
    };
  }
}

export async function loginUser(formData) {
  let success = false;

  try {
    await dbConnect();
    const cookieStore = await cookies();

    const { identifier, password } = formData;
    /*
    console.log(formData);
    console.log("username:", username);
    console.log("email:", email);
    console.log("password:", password);
    */
    const isEmail = identifier.includes("@");

    const userExists = await User.findOne(
      isEmail ? { email: identifier } : { username: identifier }
    );

    //    console.log(userExists);

    //    console.log("First PW: ", userExists.password);
    if (!userExists) {
      return {
        toastType: "warn",
        status: 401,
        error: "User Not Found",
        success: false,
      };
    }

    // const dbPassword = userExists.password;
    const { password: dbPassword, _id: userID } = userExists;

    const correctPassword = await bcrypt.compare(password, dbPassword);
    if (!correctPassword) {
      return {
        toastType: "error",
        status: 401,
        error: "Invalid Credentials",
        success: false,
      };
    }

    //    console.log("userID: ", userID);
    //    const authToken = jwt.sign({ userID }, SECRET_KEY);
    /* 
    cookieStore.set("accessToken", accessToken, {
      maxAge: 60 * 60,
      });
      */

    await createAndStoreAuthSession(cookieStore, userID);

    revalidatePath("/dashboard");
    return {
      toastType: success,
      success: true,
      status: 200,
      message: "Successfully Logged In... Redirecting To Dashboard...",
    };

    /*     
    return {
      message: "Successfully Logged In...",
      success: true,
    };
 */
  } catch (error) {
    console.error("Login Failed", error);
    return {
      success: false,
      error: "Internal Server Error",
    };
  }
}

export async function logout() {
  let success = false;

  try {
    const cookieStore = await cookies();
    const accessTokenExists = cookieStore.get("accessToken")?.value;
    const refreshTokenExists = cookieStore.get("refreshToken")?.value;

    if (accessTokenExists || refreshTokenExists) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      const tokenToDecode = accessTokenExists || refreshTokenExists;
      await deactivateSessionFromToken(tokenToDecode);

    } else {
      return {
        success: false,
        error: "Already Logged Out",
      };
    }

    success = true;
  } catch (error) {
    console.error("Logout Failed: ", error);
    return {
      success: false,
      error: "Internal Server Error",
    };
  }

  if (success) redirect("/login");
}

export async function resetPassword(formData) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const { newPassword } = formData;

    console.log("newPassword:", newPassword);

    const hashedNewPassword = await hashingPassword(newPassword);

    const { isAuthenticated, decodedToken, error } =
      await verifyAccessSession(accessToken);

    if (isAuthenticated) {
      const { userID } = decodedToken;

      /* 
      console.log(decodedToken);
      console.log(userID);
      */

      const user = await User.findOne({ _id: userID });

      //      console.log(user);
      user.password = hashedNewPassword;
      user.save();
    } else {
      return {
        success: false,
        error: error,
      };
    }

    //    console.log(newPassword);

    return {
      success: true,
      message: "Password Successfully Resetted",
    };
  } catch (error) {
    console.error("Password could not be Resetted: ", error);
    return {
      success: false,
      error: "Internal Server Error",
    };
  }
}
