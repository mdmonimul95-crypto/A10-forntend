import Link from "next/link";
// import { FaTicketAlt } from "react-icons/fa";

const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-pink-500 to-indigo-500 p-2 rounded-lg text-white shadow-md shadow-pink-500/20">
                {/* <FaTicketAlt className="text-xl" /> */}
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-pink-500 bg-clip-text text-transparent">
                Ticketo
            </span>
        </Link>
    );
};

export default Logo;