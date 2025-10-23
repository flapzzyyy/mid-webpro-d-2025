import { dashboard, login, register, logout } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

import RotatingText from '@/components/RotatingText';
import todoimg from '../../../public/to-do-list.jpg';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <>
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={logout()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Log out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <main className="flex flex-col lg:flex-row items-center justify-between w-full flex-grow px-32 py-12 lg:py-20 gap-10 max-w-7xl mx-auto">
                    <div className="flex flex-col justify-center px-16 w-full lg:w-1/2 space-y-6">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight flex flex-wrap items-baseline">
                            <span className="text-[#1b1b18] dark:text-[#EDEDEC] mr-4">
                                Manage your
                            </span>
                            <span className="inline-flex relative">
                                <RotatingText
                                    texts={['Tasks', 'Plans', 'Goals']}
                                    mainClassName="px-2 sm:px-3 bg-[#1b1b18] text-[#FDFDFC] text-xl sm:text-2xl lg:text-3xl rounded-md font-extrabold whitespace-nowrap dark:bg-[#EDEDEC] dark:text-[#1b1b18]"
                                    staggerFrom="first"
                                    initial={{ y: '100%' }}
                                    animate={{ y: 0 }}
                                    exit={{ y: '-120%' }}
                                    staggerDuration={0.025}
                                    splitLevelClassName="overflow-hidden pb-1"
                                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                                    rotationInterval={2000}
                                />
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl leading-relaxed text-[#333] dark:text-[#cfcfcf] max-w-xl">
                            Stay organized and productive with your personal To-Do List app.
                            Easily manage daily tasks, set priorities, and track your progress.
                        </p>

                        <div className="flex gap-4 mt-2">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="bg-[#1b1b18] text-[#FDFDFC] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#2b2b25] dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d6d6d6]"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={register()}
                                    className="bg-[#1b1b18] text-[#FDFDFC] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#2b2b25] dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d6d6d6]"
                                >
                                    Get Started
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex justify-center">
                        <img
                            src={todoimg}
                            alt="To-Do App Illustration"
                            className="rounded-2xl shadow-xl w-4/5 max-w-md"
                        />
                    </div>
                </main>
                <div className="hidden h-14.5 lg:block"></div>
                <footer className="w-full border-t-2 border-solid border-dark dark:border-light font-medium text-lg">
                    <div className="px-32 py-8 grid grid-cols-3 w-full items-center dark:text-[#EDEDEC]">
                        <span className="text-left"> {new Date().getFullYear()} &copy; All Rights Reserved</span>
                        <span className="text-center">To-Do-App</span>
                        <span className="text-right">Surabaya, Indonesia</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
