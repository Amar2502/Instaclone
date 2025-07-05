// app/accounrs/emailsignup/layout.tsx
export const metadata = {
    title: "Sign up - Instagram",
    description: "Private dashboard area",
  };
  
  export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <>
      <section>
        {children}
      </section>
      <footer className="bg-black text-zinc-500 text-xs text-center pt-8 py-5">
        <div className="flex flex-wrap justify-center gap-3 mb-2">
          {[
            "Meta", "About", "Blog", "Jobs", "Help", "API", "Privacy", "Terms",
            "Locations", "Instagram Lite", "Threads", "Contact uploading and non-users", "Meta Verified"
          ].map((item) => (
            <span key={item} className="hover:underline cursor-pointer">{item}</span>
          ))}
        </div>
        <p>English (UK) © 2025 Instagram from Meta</p>
      </footer></>;
  }
  