import React from 'react'
import * as HoverCard from '@radix-ui/react-hover-card';
import { SelectItem } from './Select';

const HoverCard1 = ({value , doctor , key}) => {
  return (
    <HoverCard.Root  className="" openDelay={20} closeDelay={0}>
                  <HoverCard.Trigger className=" w-full">
                    <SelectItem value={value}>{doctor.name}</SelectItem>
                  </HoverCard.Trigger>
                  <HoverCard.Portal>

                  <HoverCard.Content className=" absolute -top-10 z-[999] w-fit h-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 " sticky="always">
                      <div className=" bg-dark-400 text-white flex flex-col  p-5 rounded-md border-2 border-green-300">
                        <img src={doctor.avatar} alt="" className="w-20 h-20 rounded-full" />
                        <h1 className="text-3xl font-bold  whitespace-nowrap">{doctor.name}</h1>
                        <div className=" text whitespace-nowrap flex flex-col gap-2 pt-4">
                          <div>
                          <span>Speciality : </span>
                          <span>{doctor.speciality}</span>

                          </div>
                          <div className=' whitespace-nowrap'>
                            <span>Qualification: </span>
                            <span>{doctor.qualification}</span>
                          </div>
                          <div>
                            <span>Experience : </span>
                            <span>{doctor.experience} years</span>
                          </div>
                          <div>
                            <span>Clinic Address : </span>
                            <span className=' text-wrap'>{doctor.clinicAddress} </span>
                          </div>
                          
                        </div>
                      </div>
                        
                  </HoverCard.Content>
                  </HoverCard.Portal>

                </HoverCard.Root>
               
  )
}

export default HoverCard1