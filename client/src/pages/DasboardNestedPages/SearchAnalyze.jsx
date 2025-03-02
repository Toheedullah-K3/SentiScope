import { Input, Button } from "@/components"
import axios from "axios"
import { useForm } from "react-hook-form"
import { useState } from "react"

const SearchAnalyze = () => {
  const [name, setName] = useState("")
  const { register, handleSubmit } = useForm()

  const apiUrl = import.meta.env.VITE_API_URL

  const createSearch = async (data) => {
    try {
        const response = await axios.post(`${apiUrl}/api/v1/search/getSearchRequest`, data, {
          withCredentials: true
        })
        
        setName(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <h1 className="text-3xl capitalize font-bold">Dashboard</h1>
      <h6 className="text-lime-500 text-sm font-bold">Welcome to your Dashboard</h6>

      <form 
        onSubmit={handleSubmit(createSearch)}
        className="flex border border-white/15 rounded-full p-2 mt-8 max-w-lg mx-auto"
      >
        <Input 
          type="text" placeholder="Analyze sentiment—Try 'AI' or 'Bitcoin'!" 
          className='outline-none px-4 flex-1' 
          {...register('search')}
        />
        <Button type="submit" variant="primary" className="whitespace-nowrap h-10"> Search </Button>
      </form>
 

    <h1>{name}</h1>
    </>
  )
}

export default SearchAnalyze 