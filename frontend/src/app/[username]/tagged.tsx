import { Camera, Video } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Tagged = ({ username }: { username: string }) => {


  const author = useSelector((state: RootState) => state.auth.username);

  const isSafe = author === username;


  return (
  <>
    {/* Getting Started */}
    <div className="pt-[35px] pb-8">
      <div className="text-center mb-[60px]">
      </div>

      {isSafe && (
       <div className="flex justify-center space-x-[60px]">
       {[
         {
           title: 'Tag Photos',
           desc: 'When you tag photos, they will appear on your profile.',
           icon: <Camera size={24} />,
           btn: 'Tag your first photo',
         },
         {
           title: 'Tag Reels',
           desc: 'When you tag reels, they will appear on your profile.',
           icon: <Video size={24} className="rotate-12" />,
           btn: 'Tag your first reel',
         },
       ].map(({ title, desc, icon, btn }, i) => (
         <div key={i} className="text-center max-w-[200px]">
           <div className="w-[62px] h-[62px] border border-[#262626] rounded-full flex items-center justify-center mx-auto mb-4">
             {icon}
           </div>
           <h3 className="text-[17px] font-semibold mb-4 text-white">{title}</h3>
           <p className="text-[14px] text-[#a8a8a8] mb-6 leading-[18px]">{desc}</p>
           <button className="btn-primary">{btn}</button>
         </div>
       ))}
     </div> 
      )}

      {!isSafe && (
        <div className="text-center text-white py-10">No tagged photos</div>
      )}

    </div>  
  </>)
}

export default Tagged;