import { useEffect, useState } from "react";
import type { FC, FormEvent, MouseEvent } from "react";

interface ApiResponse {
  success: boolean;
  message: string;
}

ddd

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
        body: formData,
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
    <div id="contact" className="w-full px-[12%] py-20 scroll-mt-20">
      <h4 className="mb-1 text-lg text-center text-light-text dark:text-dark-text">Connect with me</h4>
      <h2 className="mb-1 text-4xl sm:text-5xl text-center text-light-text dark:text-dark-text">Get in touch</h2>
      <h3 className="text-xl text-center font-zen text-light-text-secondary dark:text-dark-text-secondary">お問い合わせ</h3>
      <p className="max-w-2xl mx-auto mt-5 mb-12 text-center text-light-text-secondary dark:text-dark-text-secondary">I'd love to hear from you! If you have any questions, comments, or feedback, please use the form below.</p>

      {/* form container */}
      <div className="max-w-4xl mx-auto glass-premium p-10 sm:p-14 rounded-[2.5rem]">
        <div className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl text-light-text dark:text-dark-text">
            Get in touch
          </h2>
          <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mt-4 opacity-70">
            Nocturnal Contact System
          </p>
        </div>

        {/* form */}
        <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
          {/* grid for inputs */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                className="neu-input px-5 py-4 rounded-xl text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                name="email"
                required
                placeholder="Your email"
                className="neu-input px-5 py-4 rounded-xl text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                name="subject"
                required
                placeholder="Subject"
                className="neu-input px-5 py-4 rounded-xl text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Message"
                className="neu-input px-5 py-4 rounded-xl text-sm resize-none"
              ></textarea>
            </div>
          </div>

          {/* submit button */}
          <div className="mt-10 flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-max px-12 py-4 rounded-full font-medium text-white transition-all duration-300 bg-gradient-to-r from-[#c060f5] to-[#7b5aff] shadow-[0_8px_24px_rgba(192,96,245,0.30)] hover:shadow-[0_12px_32px_rgba(192,96,245,0.40)] hover:-translate-y-1 active:scale-95"
            >
              Submit Now
            </button>
          </div>

          {/* result modal */}
          {result && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              onClick={() => result !== "Sending...." && setResult("")}
            >
              <div
                className="glass-premium rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 transform transition-all"
                onClick={handleModalClick}
              >
                <div className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${result === "Form Submitted Successfully"
                      ? "bg-green-500/20 text-green-500"
                      : result === "Sending...."
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-red-500/20 text-red-500"
                      }`}
                  >
                    {result === "Form Submitted Successfully" && (
                      <i className="ri-check-line text-3xl"></i>
                    )}
                    {result === "Sending...." && (
                      <i className="ri-loader-4-line text-3xl animate-spin"></i>
                    )}
                    {result !== "Form Submitted Successfully" &&
                      result !== "Sending...." && (
                        <i className="ri-error-warning-line text-3xl"></i>
                      )}
                  </div>

                  <h3 className="text-xl mb-2 text-light-text dark:text-dark-text">
                    {result === "Form Submitted Successfully" && "Success!"}
                    {result === "Sending...." && "Sending..."}
                    {result !== "Form Submitted Successfully" &&
                      result !== "Sending...." &&
                      "Oops!"}
                  </h3>
                  <p className="text-sm opacity-70 mb-6 text-light-text-secondary dark:text-dark-text-secondary">{result}</p>

                  {result !== "Sending...." && (
                    <button
                      onClick={() => setResult("")}
                      className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium text-light-text dark:text-dark-text"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;
