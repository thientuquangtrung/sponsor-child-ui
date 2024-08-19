import { appConfig } from "@/config/app";
import { Icons } from "./icons";

export function Logo() {
    return (
        <>
            <Icons.logo className="h-12 w-12" />
            <Icons.textLogoBlack className="h-12" />
        </>
    )
}