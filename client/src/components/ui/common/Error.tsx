
interface ErrorProps {
    error : string | null;
};

const Error = ({ error }: ErrorProps) => {

    if (!error) return null;

    return (
        <div className="flex justify-center items-center min-h-[350px]">
            <div className="mx-auto w-full max-w-2xl relative flex flex-col items-center justify-center text-center overflow-visible">
                <h3 className="mb-6 text-3xl font-bold">{error}</h3>
                <div className="w-full relative flex flex-col items-center justify-center">
                    <div className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-white to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-global-purple dark:to-transparent h-[2px] w-full blur-sm" />
                    <div className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-global-redpink to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-global-purple dark:to-transparent h-px w-full" />
                    <div className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-global-pink to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-global-pink dark:to-transparent h-[5px] w-1/2 blur-sm" />
                    <div className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-global-purple to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-global-redpink dark:to-transparent h-px w-1/2" />
                    <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(50%_200px_at_top,transparent_20%,white)]" />
                </div>
                <p className="mt-6 text-sm">I am having trouble loading this right now.</p>
                <p className="mt-2 text-sm">Please tyr again shortly.</p>
                <span className="absolute -z-[1] backdrop-blur-sm inset-0 w-full h-full flex before:content-[''] before:h-3/4 before:w-full before:bg-gradient-to-r before:from-global-purple before:to-global-pink before:blur-[90px] after:content-[''] after:h-1/2 after:w-full after:bg-gradient-to-br after:from-global-purple after:to-global-blue after:blur-[90px]" />
            </div>
        </div>
    );
};

export default Error
