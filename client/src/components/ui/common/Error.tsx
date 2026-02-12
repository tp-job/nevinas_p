interface ErrorProps {
    error: string | null;
}

const Error = ({ error }: ErrorProps) => {
    if (!error) return null;

    return (
        <div className="flex justify-center items-center min-h-[350px]">
            <div className="mx-auto w-full max-w-2xl relative flex flex-col items-center justify-center text-center overflow-visible">
                {/* Icon */}
                <div className="flex items-center justify-center w-14 h-14 mb-5 rounded-2xl bg-global-redpink/10 dark:bg-global-redpink/20 border border-global-redpink/20">
                    <i className="ri-error-warning-line text-2xl text-global-redpink"></i>
                </div>

                <h3 className="mb-4 text-2xl font-bold text-light-text dark:text-dark-text">{error}</h3>

                {/* Gradient line divider */}
                <div className="w-full relative flex flex-col items-center justify-center">
                    <div className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-white to-transparent dark:from-transparent dark:via-global-purple dark:to-transparent h-[2px] w-full blur-sm" />
                    <div className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-global-redpink to-transparent dark:from-transparent dark:via-global-purple dark:to-transparent h-px w-full" />
                    <div className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-global-pink to-transparent dark:from-transparent dark:via-global-pink dark:to-transparent h-[5px] w-1/2 blur-sm" />
                    <div className="absolute inset-x-auto top-0 bg-gradient-to-r from-transparent via-global-purple to-transparent dark:from-transparent dark:via-global-redpink dark:to-transparent h-px w-1/2" />
                    <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(50%_200px_at_top,transparent_20%,white)]" />
                </div>

                <p className="mt-6 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    I am having trouble loading this right now.
                </p>
                <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Please try again shortly.
                </p>

                {/* Ambient blur background */}
                <span className="absolute -z-[1] backdrop-blur-sm inset-0 w-full h-full flex before:content-[''] before:h-3/4 before:w-full before:bg-gradient-to-r before:from-global-purple before:to-global-pink before:blur-[90px] after:content-[''] after:h-1/2 after:w-full after:bg-gradient-to-br after:from-global-purple after:to-global-blue after:blur-[90px]" />
            </div>
        </div>
    );
};

export default Error;
