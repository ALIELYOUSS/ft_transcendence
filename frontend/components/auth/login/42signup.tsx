export function LoginFortytwo() {
    return (
        <div className="p-11 h-[100px] w-[580px] items-center flex gap-5 flex-col rounded-[20px] justify-center">
            <div className="flex flex-row items-baseline-last justify-center gap-4 w-full">
                <div className="bg-[#334155] h-[1px] w-[280px] mb-4"></div> 
                <div className="bg-[#151B2A]"><h1 className="text-[#64748B] text-sm">OR</h1></div>
                <div className="bg-[#334155] h-[1px] w-[280px] mb-4"></div>

            </div>
                <button className="relative bg-[#6141E8] flex items-center justify-center font-inter text-xl text-black rounded-[10px] h-[50px] w-[330px] p-2" >
                    {/* <img 
                        src="/autlogo.png" 
                        alt="42 Logo" 
                        className="absolute left-3 h-[40px] w-[40px] object-contain"
                    /> */}
                    <span>Sign in with 42</span>
                </button>
                <div>
                    <h6 className="text-[#64748B]">Don't have an account? <span className="text-[#A78BFA]">Signup</span></h6>
                </div>
            </div>
    );
}
