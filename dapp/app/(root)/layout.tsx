import Header from "@/components/Header"

const layout = ({children}: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>

        <Header title={"Learn On Cardano"}/>
        {children}
    </div>
  )
}

export default layout