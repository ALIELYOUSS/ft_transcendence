import Image from "next/image"
import Header from "./header";
import {EmailBar} from "./email.bar";
import { LoginFortytwo } from "./42signup";

export default function Login() {
    

    return (
        <div className="p-11 bg-[#151B2AF2] h-[812px] w-[580px] items-center flex flex-col rounded-[20px] space-auto justify-between
         shadow-lg shadow-[#a48fe4]">
            <Header ></Header>
            <EmailBar ></EmailBar>
            <LoginFortytwo ></LoginFortytwo>
            
        </div>
    )
}