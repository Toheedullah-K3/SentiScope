import { createContext, useState } from "react"
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react"

export const SidebarContext = createContext()

const Sidebar = ({ children }) => {
    const [expanded, setExpanded] = useState(true)

    return (
        <aside className="h-screen">
            <nav className="h-full flex flex-col border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">

                    <h1 className={`font-extrabold text-3xl overflow-hidden transition-all ${expanded ? "w-52" : "w-0"
                        }`}>SentiScope</h1>
                    <button
                        onClick={() => setExpanded(curr => !curr)}
                        className="p-1.5 rounded-lg hover:bg-lime-400 hover:text-gray-800">
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>

                <SidebarContext.Provider value={{ expanded, setExpanded }}>
                    <ul className="flex-1 px-3"> {children} </ul>
                </SidebarContext.Provider>


                <div className="border-t flex p-3">
                    <img
                        src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
                        alt=""
                        className="w-10 h-10 rounded-md"
                    />
                    <div className={`flex justify-between items-center  overflow-hidden transition-all ${expanded ? "w-52" : "w-0"
                        }`}>
                        <div className="leading-4 pl-3">
                            <h4 className="font-semibold">John Doe</h4>
                            <span className="text-xs text-gray-400">johndoe@gmail.com</span>
                        </div>
                        <MoreVertical size={20} />
                    </div>
                </div>
            </nav>
        </aside>
    )
}

export default Sidebar