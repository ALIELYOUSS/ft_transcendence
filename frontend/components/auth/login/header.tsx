import { Italiana } from "next/font/google";

export default function Header() {
    return (
        <div className="bg-[#151B2AF2] h-[172px] w-[350px] rounded-[30px] gap-2 flex items-center p-4 justify-center flex-col">
            <img src="/logo.png" alt="logo failed to load" width={500} height={500} className="flex items-center rounded-[26px] h-[100px] w-[100px]"/>
            <div className=" bg-[#151B2AF2] flex items-center justify-center flex-col gap-2">
                <h1 className="flex items-center text-xl text-[#FFFFF]">
                    <span className="font-inter font-bold text-[#FFFF] text-xl">we</span>
                    <span className="font-inter font-bold text-[#A78BFA] text-xl">meet</span>
                </h1>
                <p className="flex items-start text-l text-[#94A3B8] text-center ">Turn shared interests into real-world meetups.</p>
            </div>
        </div>
    );
}