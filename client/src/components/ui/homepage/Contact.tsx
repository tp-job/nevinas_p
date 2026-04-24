import { useEffect, useState } from "react";
import type { FC, FormEvent, MouseEvent } from "react";

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
      {/* form container */}
      <div className="max-w-4xl mx-auto glass-premium p-10 sm:p-14 rounded-[2.5rem] bg-white/70 dark:bg-[#232840]/60 backdrop-blur-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-black/5 dark:border-white/5">
        <div className="mb-12 text-center">
          <h1 className="font-manrope text-4xl sm:text-5xl font-bold tracking-tight text-[#1a1c27] dark:text-[#f1f3f5]">
            Get in touch
          </h1>
          <p className="text-sm font-medium text-[#5b6475] dark:text-[#8a94a8] mt-4 opacity-70">
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
                className="w-full px-5 py-4 rounded-xl border-none outline-none transition-all duration-300 bg-[#ffffff] dark:bg-[#232840] text-[#1a1c27] dark:text-[#f1f3f5] shadow-[6px_6px_14px_rgba(0,0,0,0.1),-6px_-6px_14px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.6),-6px_-6px_14px_rgba(48,55,78,0.45)] focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.9),0_0_10px_rgba(89,131,252,0.4)] dark:focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(48,55,78,0.45),0_0_10px_rgba(89,131,252,0.4)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                name="email"
                required
                placeholder="Your email"
                className="w-full px-5 py-4 rounded-xl border-none outline-none transition-all duration-300 bg-[#ffffff] dark:bg-[#232840] text-[#1a1c27] dark:text-[#f1f3f5] shadow-[6px_6px_14px_rgba(0,0,0,0.1),-6px_-6px_14px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.6),-6px_-6px_14px_rgba(48,55,78,0.45)] focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.9),0_0_10px_rgba(89,131,252,0.4)] dark:focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(48,55,78,0.45),0_0_10px_rgba(89,131,252,0.4)]"
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                name="subject"
                required
                placeholder="Subject"
                className="w-full px-5 py-4 rounded-xl border-none outline-none transition-all duration-300 bg-[#ffffff] dark:bg-[#232840] text-[#1a1c27] dark:text-[#f1f3f5] shadow-[6px_6px_14px_rgba(0,0,0,0.1),-6px_-6px_14px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.6),-6px_-6px_14px_rgba(48,55,78,0.45)] focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.9),0_0_10px_rgba(89,131,252,0.4)] dark:focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(48,55,78,0.45),0_0_10px_rgba(89,131,252,0.4)]"
              />
            </div>
            <div className="sm:col-span-2">
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Message"
                className="w-full px-5 py-4 rounded-xl border-none outline-none transition-all duration-300 bg-[#ffffff] dark:bg-[#232840] text-[#1a1c27] dark:text-[#f1f3f5] shadow-[6px_6px_14px_rgba(0,0,0,0.1),-6px_-6px_14px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.6),-6px_-6px_14px_rgba(48,55,78,0.45)] focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.9),0_0_10px_rgba(89,131,252,0.4)] dark:focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(48,55,78,0.45),0_0_10px_rgba(89,131,252,0.4)] resize-none"
              ></textarea>
            </div>
          </div>

          {/* submit button */}
          <div className="mt-10 flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-max px-12 py-4 rounded-full font-bold text-white transition-all duration-300 bg-gradient-to-r from-[#5983FC] via-[#964EC2] to-[#FF7BBF] shadow-[0_0_20px_rgba(89,131,252,0.4)] hover:shadow-[0_0_30px_rgba(150,78,194,0.6)] hover:-translate-y-1 active:scale-95"
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
                className="glass-premium border border-white/20 rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 transform transition-all"
                onClick={handleModalClick}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      result === "Form Submitted Successfully"
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
                  
                  <h3 className="text-xl font-bold mb-2">
                    {result === "Form Submitted Successfully" && "Success!"}
                    {result === "Sending...." && "Sending..."}
                    {result !== "Form Submitted Successfully" &&
                      result !== "Sending...." &&
                      "Oops!"}
                  </h3>
                  <p className="text-sm opacity-70 mb-6">{result}</p>

                  {result !== "Sending...." && (
                    <button
                      onClick={() => setResult("")}
                      className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold"
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
