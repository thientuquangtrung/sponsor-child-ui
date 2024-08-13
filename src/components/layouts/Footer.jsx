import { appConfig } from '@/config/app';
import logo from '@/assets/images/logo.png';
import { Copyright, MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="min-h-[3rem] border-t">
            <div className="container flex flex-col items-center justify-between gap-4 md:flex-row py-[40px]">
                <div>
                    <img src={logo} alt="intratech" />
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left mt-4">
                        A product by{' '}
                        <a
                            href={appConfig.author.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            {appConfig.author.name}.
                        </a>
                    </p>
                </div>
                <div>
                    <p className="flex items-center justify-center text-sm leading-loose text-muted-foreground md:justify-end">
                        {/* get current year */}
                        <Copyright className="mr-1 text-muted-foreground" /> {new Date().getFullYear()} All rights
                        reserved
                    </p>
                    <p className="flex items-center justify-center text-sm leading-5 mt-2 text-muted-foreground md:justify-end">
                        <MapPin className="mr-1 text-muted-foreground" />
                        GIFC Tower-1504, 240 Kintex-ro, Ilsanseo-gu, Goyang-si, Gyeonggi-do, 10391, KOREA
                    </p>
                </div>
            </div>
        </footer>
    );
}
