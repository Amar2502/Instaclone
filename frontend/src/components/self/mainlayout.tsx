import Sidebar from "./sidebar";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar (Fixed height, non-scrollable) */}
      {/* <div className="w-64 h-screen sticky top-0 border-r border-zinc-800 bg-black"> */}
        <Sidebar/>
      {/* </div> */}

      {/* Main Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1">{children}</div>
        
        {/* Footer */}
        <footer className="w-full flex flex-col items-center text-zinc-500 text-xs py-4">
          {/* Top Link Row */}
          <div className="flex flex-wrap justify-center gap-4 mb-5">
            <span className="hover:underline cursor-pointer">Meta</span>
            <span className="hover:underline cursor-pointer">About</span>
            <span className="hover:underline cursor-pointer">Blog</span>
            <span className="hover:underline cursor-pointer">Jobs</span>
            <span className="hover:underline cursor-pointer">Help</span>
            <span className="hover:underline cursor-pointer">API</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span className="hover:underline cursor-pointer">Terms</span>
            <span className="hover:underline cursor-pointer">Locations</span>
            <span className="hover:underline cursor-pointer">Instagram Lite</span>
            <span className="hover:underline cursor-pointer">Threads</span>
            <span className="hover:underline cursor-pointer">
              Contact uploading and non-users
            </span>
            <span className="hover:underline cursor-pointer">Meta Verified</span>
          </div>

          {/* Language + Copyright */}
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">English (UK)</span>
            <span>© 2025 Instagram from Meta</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
