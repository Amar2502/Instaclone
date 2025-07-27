import Sidebar from "./sidebar";

type MessageLayoutProps = {
  children: React.ReactNode;
};

export default function MessageLayout({ children }: MessageLayoutProps) {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
        <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
