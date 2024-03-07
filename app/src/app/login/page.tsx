import Logo from "@/components/Logo";
import { LogoIcon } from "@/components/LogoIcon";

export default function Login() {
    return (
        <div className="flex flex-col justify-around h-screen bg-indigo-blue">
            <header className="flex items-center justify-between px-8 pt-10">
                <LogoIcon />
                <Logo />
            </header>
            <div>Login</div>
        </div>
    )
}