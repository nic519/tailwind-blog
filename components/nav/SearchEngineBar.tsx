import { useState } from 'react'
import { BiSearchAlt } from "react-icons/bi"
import { FcGoogle } from "react-icons/fc"
import { BsBing } from "react-icons/bs"
import Image from 'next/image'
const searchEngines = [
  {
    name: 'Google',
    icon: <FcGoogle className="w-5 h-5" />,
    url: 'https://www.google.com/search?q=',
  },
  {
    name: 'Bing',
    icon: <BsBing className="w-5 h-5" />,
    url: 'https://www.bing.com/search?q=',
  },
  
  {
    name: 'Baidu',
    icon: (
      <Image 
        src="/static/images/svg/baidu-icon.svg" 
        alt="Baidu" 
        width={20}
        height={20}
        className="w-5 h-5" 
      />
    ),
    url: 'https://www.baidu.com/s?wd=',
  },
]

export default function SearchBar() {
  const [searchText, setSearchText] = useState('')
  const [selectedEngine, setSelectedEngine] = useState(searchEngines[0])
  const [isEngineMenuOpen, setIsEngineMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchText.trim()) {
      window.open(selectedEngine.url + encodeURIComponent(searchText), '_blank')
    }
  }

  return (
    <div className=" max-w-xl mb-12">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsEngineMenuOpen(!isEngineMenuOpen)}
            className="flex items-center gap-2 px-4 h-10 rounded-l-lg 
              bg-white dark:bg-gray-800/80 hover:bg-gray-50 
              dark:hover:bg-gray-700/90 transition-colors 
              border-l border-y border-gray-300 dark:border-transparent"
          >
            {selectedEngine.icon}
            <span className="hidden sm:inline">{selectedEngine.name}</span>
          </button>
          
          {isEngineMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 
              rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              {searchEngines.map((engine) => (
                <button
                  key={engine.name}
                  type="button"
                  onClick={() => {
                    setSelectedEngine(engine)
                    setIsEngineMenuOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 
                    dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {engine.icon}
                  <span>{engine.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="输入搜索内容..."
          className="flex-1 px-4 h-10 bg-gray-50 dark:bg-gray-800/80  
            focus:bg-white dark:focus:bg-gray-800 outline-none
            transition-colors border-r border-y border-gray-300 dark:border-transparent
            focus:ring-0 focus:border-gray-300 dark:focus:border-transparent"
        />

        <button
          type="submit"
          className="px-6 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 
            text-white rounded-r-lg hover:from-blue-600 hover:to-cyan-600 
            transition-colors flex items-center"
        >
          <BiSearchAlt className="w-5 h-5" /> 
        </button>
      </form>
    </div>
  )
} 