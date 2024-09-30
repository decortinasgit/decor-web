import { IconLoader2 } from "@tabler/icons-react"

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-svh w-full">
      <IconLoader2 className="mr-2 h-20 w-20 text-primary animate-spin" />
    </div>
  )
}

export default Loader
