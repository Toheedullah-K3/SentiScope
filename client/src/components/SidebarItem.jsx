import { useContext } from "react"
import { SidebarContext } from "./SidebarItemParent.jsx"
import { AnimatePresence, motion } from "framer-motion"

const SidebarItem = ({
    icon,
    text,
    hoverText,
    active,
    alert,
    onClick
}) => {
    const { expanded } = useContext(SidebarContext)

    return (
        <AnimatePresence>
            <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}


                onClick={onClick}
                className={`relative flex items-center py-2 px-3 my-1 h-11 font-medium rounded-md cursor-pointer transition-colors group
            ${active ? 'bg-gradient-to-tr from-lime-400 to-lime-500 text-gray-800' : 'text-gray-300 hover:bg-lime-400 hover:text-gray-800'}`
                }>
                {icon}
                <span className={`overflow-hidden  transition-[width]  ${expanded ? 'w-52 ml-3' : 'w-0'}`} >
                    {text}
                </span>
                {alert && <div className={`absolute right-2 w-2 h-2 rounded bg-lime-400 ${expanded ? "" : 'top-2'}`}></div>}

                {!expanded &&
                    <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-lime-400 text-gray-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
                        {hoverText}
                    </div>
                }
            </motion.li>

        </AnimatePresence>
    )
}

export default SidebarItem