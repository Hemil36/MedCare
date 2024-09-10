import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Check, Loader } from 'lucide-react'
import React from 'react'
import { Controller } from 'react-hook-form'

const Consent = ({register,control,loading,type}) => {
  return (
    <div className=' py-4'>

    <h1 className=" text-md md:text-3xl font-bold"> Consent & Privacy</h1>
    <div className='  justify-start gap-2  w-full mt-2'>
        <div className='flex items-center gap-2 py-2 '>
        <Controller
              name="privacyConsent"
              control={control}
              defaultValue=""
              render={({ field }) => (
        <Checkbox id="privacyConsent" className="text-gray-400 " checked={field.value} onCheckedChange={()=>{
          field.onChange(!field.value)
        }} >
        </Checkbox>
              )}
            />
            <span className="md:text-md text-sm text-gray-400">I acknowledge that I have reviewed and agree to the privacy policy</span>

        </div>
        {type == "patient" && <div className=' flex items-center gap-2 py-2'>

        <Controller
              name="treatmentConsent"
              control={control}
              defaultValue=""
              render={({ field }) => (
        <Checkbox id="treatmentConsent" className="text-gray-400 " checked={field.value} onCheckedChange={()=>{
          field.onChange(!field.value)
        }} >
        </Checkbox>
              )}
            />
            <span className="md:text-md text-sm text-gray-400">I consent to the use and disclosure of my health information for treatment purposes.</span>
        
        </div> }
        <Button className="bg-green-500 text-white rounded-md p-2 m-2 w-full " type="submit">
          {loading ? <>
          <Loader className='animate-spin' />
          Loading...
          
          </>: 'Submit'}
          </Button>

    </div>
    </div>
  )
}

export default Consent