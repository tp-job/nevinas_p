import { useEffect, useState } from 'react';
import type { FC, FormEvent, MouseEvent } from 'react';

interface ApiResponse {
    success: boolean;
    message: string;
}

const Contact: FC = () => {
    const [result, setResult] = useState<string>("");

    useEffect(() => {
        if (!result) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && result !== "Sending....") {
                setResult("");
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [result]);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setResult("Sending....");
        const formData = new FormData(event.target as HTMLFormElement);
        formData.append("access_key", "49cce593-2ca1-47d6-a6a8-4ffe07b78f39");
        
        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data: ApiResponse = await response.json();

            if (data.success) {
                setResult("Form Submitted Successfully");
                (event.target as HTMLFormElement).reset();
            } else {
                console.log("Error", data);
                setResult(data.message);
            }
        } catch (error) {
            console.error("Submission Error:", error);
            setResult("An error occurred while submitting the form.");
        }
    };

    const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div id="contact" className="w-full px-[12%] py-10 scroll-mt-20">
            <h4 className="mb-2 text-lg text-center text-light-text dark:text-dark-text">Connect with me</h4>
            <h2 className="mb-2 text-5xl text-center text-light-text dark:text-dark-text">Get in touch</h2>
            <h2 className="text-2xl text-center font-zen text-light-text-secondary dark:text-dark-text-secondary">お問い合わせ</h2>
            <p className="max-w-2xl mx-auto mt-5 mb-12 text-center text-light-text dark:text-dark-text">I'd love to hear from you! If you have any questions, comments, or feedback, please use the form below.</p>
            {/* form */}
            <form onSubmit={onSubmit} className="max-w-3xl p-6 mx-auto border rounded-2xl border-light-surface-2 dark:border-dark-bg">
                {/* user */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block mb-1 text-sm">Your name</label>
                        <input type="text" name="name" required placeholder="Name" className="text-light-text-secondary w-full px-4 py-3 bg-transparent border rounded-xl border-dark-border outline-none focus:border-global-purple transition-colors" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">Your email</label>
                        <input type="email" name="email" required placeholder="Email" className="text-light-text-secondary w-full px-4 py-3 bg-transparent border rounded-xl border-dark-border outline-none focus:border-global-purple transition-colors" />
                    </div>
                </div>
                {/* subject */}
                <div className="mt-4">
                    <label className="block mb-1 text-sm">Subject</label>
                    <input type="text" name="subject" required placeholder="Subject" className="text-light-text-secondary w-full px-4 py-3 bg-transparent border rounded-xl border-dark-border outline-none focus:border-global-purple transition-colors" />
                </div>
                {/* message */}
                <div className="mt-4">
                    <label className="block mb-1 text-sm">Message</label>
                    <textarea name="message" required rows={6} placeholder="Message" className="text-light-text-secondary w-full px-4 py-3 bg-transparent border rounded-xl border-dark-border outline-none focus:border-global-purple transition-colors resize-vertical"></textarea>
                </div>
                {/* submit button */}
                <button type="submit" className="flex items-center gap-2 px-10 py-3 mx-auto mt-6 text-dark-text rounded-full w-max bg-gradient-to-r from-global-pink to-global-purple hover:opacity-90 transition-opacity">
                    Submit now
                    <i className="ri-arrow-right-s-line"></i>
                </button>

                {/* modal */}
                {result && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-light-bg/60 dark:bg-dark-bg/60 backdrop-blur-sm" onClick={() => result !== "Sending...." && setResult("")}>
                        <div className="card-glass border border-light-border dark:border-dark-border rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all" onClick={handleModalClick}>
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${result === "Form Submitted Successfully"
                                            ? "bg-green-500 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                            : result === "Sending...."
                                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                        }`}>
                                        {result === "Form Submitted Successfully" && (
                                            <i className="ri-check-circle-fill text-2xl"></i>
                                        )}
                                        {result === "Sending...." && (
                                            <i className="ri-loader-4-line text-2xl animate-spin"></i>
                                        )}
                                        {result !== "Form Submitted Successfully" && result !== "Sending...." && (
                                            <i className="ri-error-warning-fill text-2xl"></i>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="card-title text-lg font-semibold">
                                            {result === "Form Submitted Successfully" && "Success!"}
                                            {result === "Sending...." && "Sending..."}
                                            {result !== "Form Submitted Successfully" && result !== "Sending...." && "Error"}
                                        </h3>
                                        <p className="muted-contrast mt-1">
                                            {result}
                                        </p>
                                    </div>
                                </div>

                                {result !== "Sending...." && (
                                    <div className="flex justify-end gap-3 pt-4 border-t border-light-border dark:border-dark-border">
                                        <button onClick={() => setResult("")} className="px-4 py-2 text-sm font-medium text-light-text-secondary bg-light-bg rounded-lg hover:bg-light-surface dark:text-dark-text dark:bg-light-text-secondary dark:hover:bg-dark-bg transition-colors"
                                        >Close</button>
                                        {result === "Form Submitted Successfully" && (
                                            <button onClick={() => setResult("")} className="px-4 py-2 text-sm font-medium text-dark-text bg-gradient-to-r from-global-pink to-global-purple rounded-lg hover:opacity-90 transition-opacity">Great!</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Contact;