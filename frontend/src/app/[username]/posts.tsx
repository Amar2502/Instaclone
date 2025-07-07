import { Camera } from "lucide-react";

const Posts = () => {
    return (<>
    {/* Getting Started */}
        <div className="pt-[35px] pb-8">
        <div className="text-center mb-[60px]">
        </div>
        
        <div className="flex justify-center space-x-[60px]">
          {[
            {
              title: 'Share Photos',
              desc: 'When you share photos, they will appear on your profile.',
              icon: <Camera size={24} />,
              btn: 'Share your first photo',
            }
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
        </div>  </>)
}

export default Posts;