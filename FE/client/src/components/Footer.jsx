import { FaFigma, FaXTwitter, FaInstagram, FaYoutube, FaLinkedin, FaPhone } from "react-icons/fa6";
import { AiOutlineMail } from "react-icons/ai";
const Footer = () => {
  return (
    <div className="flex justify-between bg-[#F8E9E7] px-[160px]">
        <div className="w-1/5 h-[250px]"> 
            <div className="font-bold text-2xl mt-8 mb-4">Contact</div> 
            <div className="flex justify-space-between gap-6 mb-8">
                <FaPhone className="w-6 h-6 text-black" />
                <div className="font-bold">0977648291</div>
            </div> 
            <div className="flex justify-space-between gap-6">
                <FaXTwitter className="w-6 h-6 text-black" />
                <FaInstagram className="w-6 h-6 text-black" />
                <FaYoutube className="w-6 h-6 text-black" />
                <AiOutlineMail className="w-6 h-6 text-black" />
            </div>
        </div>
        <div className="w-1/5">
            <div className="font-bold text-2xl mt-8 mb-4">Use cases</div>
            <div className="flex flex-col gap-y-2">
                <div>UI design</div>
                <div>Wireframing</div>
                <div>Diagramming</div>
                <div>Brainstorming</div>
                <div>Online whiteboard</div>
                <div className="mb-5">Team collaboration</div>
            </div>
        </div>
        <div className=" w-1/4">
            <div className="p-6 ">
            <h2 className="font-bold text-2xl mb-4">Working Time</h2>
            <table>
                <tbody>
                    <tr className="border-b border-gray-400">
                        <td className="pr-6 py-2">Monday</td>
                        <td className="border-l border-gray-400 pl-2">9h30 - 18h30</td>
                    </tr>
                    <tr className="border-b border-gray-400">
                        <td className="pr-6 py-2">Tuesday</td>
                        <td className="border-l border-gray-400 pl-2">9h30 - 18h30</td>
                    </tr>
                    <tr className="border-b border-gray-400">
                        <td className="pr-6 py-2">Wednesday</td>
                        <td className="border-l border-gray-400 pl-2">9h30 - 18h30</td>
                    </tr>
                    <tr className="border-b border-gray-400">
                        <td className="pr-6 py-2">Thursday</td>
                        <td className="border-l border-gray-400 pl-2">9h30 - 18h30</td>
                    </tr>
                    <tr className="border-b border-gray-400">
                        <td className="pr-6 py-2">Friday</td>
                        <td className="border-l border-gray-400 pl-2">9h30 - 18h30</td>
                    </tr>
                    <tr className="border-b border-gray-400">
                        <td className="pr-6 py-2">Saturday</td>
                        <td className="border-l border-gray-400 pl-2">9h30 - 18h30</td>
                    </tr>
                    <tr>
                        <td className="pr-6 py-2">Sunday</td>
                        <td className="border-l border-gray-400 pl-2">9h30 - 18h30</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        <div className=" w-1/5">
            <div className="font-bold text-2xl mt-8 mb-4">Explore</div>
            <div className="flex flex-col gap-y-2">
                <div>Design</div>
                <div>Prototyping</div>
                <div>Development features</div>
                <div>Design systems</div>
                <div>Design process</div>
                <div className="mb-5">FigJam</div>
            </div>
        </div>
    </div>
  );
}
export default Footer;