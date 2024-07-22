import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Label } from '@radix-ui/react-label'
import { Mail, Phone, ToyBrick } from 'lucide-react'
import React from 'react'

const FormField = ({type , error , message , placeholder }) => {
    const ok = type
    console.log(ok)

    const inputfield = ()=>{
        switch (type) {
            case 'email':
                return <Mail className="ml-2 " color="#ffffff" />
            case 'name':
                return <ToyBrick className="ml-2 " color="#ffffff" />
            case 'phone':
                return <Phone className="ml-2 " color="#ffffff" />
        
            default:
                break;
        }
    }


  return (
    <div><div className=" flex-1 text-gray-400 my-2">
    <Label htmlFor="email" >

      {/* <span className={cn('',{'text-red-700' : error[type] })}   > {!error[type] ? {message} : error[type]} </span> */}
    </Label>
    <div className=" flex items-center bg-dark-400 rounded-md mt-1  focus-within:ring focus-within:ring-offset-green-300  focus-within:ring-offset-1">
     
      {inputfield()}
      
      <Input
        id={type}
        placeholder={placeholder}
        className=" border-0 shad-input text-zinc-100 font-normal"
        autoComplete="off"
      />
    </div>
  </div>
  </div>
  )
}

export default FormField