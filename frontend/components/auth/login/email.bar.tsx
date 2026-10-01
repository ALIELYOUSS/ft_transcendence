export function EmailBar() {

    interface FormData {
        // username: string;
        email: string;
        password: string;
    }
    const respose = async (data:FormData) => {
        
    }
    return (
        <div className="justify-around flex flex-col items-center h-[378px] gap-[20px] w-[378px] rounded-[30px] p-10">
            <div className="flex items-start justify-start p-2 flex-col gap-3 w-[330px]">
                <h6 className="font-inter text-sm text-[#CBD5E1] " >Email Addres</h6>
                <input type="text" placeholder="email" className="bg-[#a5b3c1] rounded-[10px] h-[50px] w-[330px] p-2"/>
            </div>
            <div className="flex items-start justify-start p-2 flex-col gap-3 w-[330px]">
                <div className="flex items-center justify-between w-[330px]">
                    <h6 className="font-inter text-sm text-[#CBD5E1]">Password</h6>
                    <a href="" className="text-[#A78BFA]">Forgot?</a>
                </div>
                <input type="text" placeholder="password" className="bg-[#b7bbc6] rounded-[10px] h-[50px] w-[330px] p-2"/>
            </div>
            <div>
                <button className="bg-[#6141E8] flex items-center justify-center font-inter text-xl text-black rounded-[10px] h-[50px] w-[330px] p-2 " >Sign in</button>
            </div>
        </div>
    );
}