import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { forgotID } from '@/lib/store/AsyncThunks'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const ForgotId = () => {
    const [email, setEmail] = React.useState('')
    const dispatch = useDispatch()
    const onSubmit = async (e) => {
        e.preventDefault()
        console.log("pop")
        console.log(email)
        try {
            await dispatch(forgotID({email}));
        }
        catch (e) {
            console.log(e)
        }
        
    }

  return (
    <div>
          <div className="flex h-screen max-h-screen  ">

<h1 className=" text-left text-2xl font-bold absolute top-4 left-4">MedID</h1>
<Link to="/" className="text-left text-1xl font-bold absolute top-4 right-4">Home</Link>
      <section className="remove-scrollbar container my-auto md:flex md:flex-row md:gap-20 px-[5%] ">
        <form className='size-full' onSubmit={onSubmit}>
<Label htmlFor="email" className="text-zinc-100 font-normal">Email</Label>
        <div className=" flex items-center bg-dark-400 rounded-md mt-1 focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
                <Input
                  id="name"
                  placeholder="Enter your email"
                  className=" border-0 shad-input text-zinc-100 font-normal"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            <Button type="submit" className=" bg-green-400 mt-3 ">Submit</Button>
        </form>
      </section>
      </div>
    </div>
  )
}

export default ForgotId