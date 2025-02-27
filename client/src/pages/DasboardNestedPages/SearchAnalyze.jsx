import { Input, Button } from "@/components"

const SearchAnalyze = () => {
  return (
    <>
      <h1 className="text-3xl capitalize font-bold">Dashboard</h1>
      <h6 className="text-lime-500 text-sm font-bold">Welcome to your Dashboard</h6>

      <form className="flex border border-white/15 rounded-full p-2 mt-8 max-w-lg mx-auto">
        <Input type="text" placeholder="Analyze sentiment—Try 'AI' or 'Bitcoin'!" className='outline-none px-4 flex-1' />
        <Button type="submit" variant="primary" className="whitespace-nowrap h-10"> Search </Button>
      </form>
 


    </>
  )
}

export default SearchAnalyze 