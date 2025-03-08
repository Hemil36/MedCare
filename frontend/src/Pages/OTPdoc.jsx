// import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEmail, getpatientID, setLoading, setOtp } from "@/lib/store/UserSlice";
import { verifyOTP,login, loginDoctor } from "@/lib/store/AsyncThunks";
import { toast } from "@/components/ui/use-toast";

export const OtpDoc = ({setOpen,setVerify}) => {
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const patientID = useSelector(getpatientID);
  const email = useSelector(getEmail);

  const closeModal = () => {
    setOpen(false);

  };

  const validatePasskey = async (e) => {
    e.preventDefault();
    try{
    const t = await dispatch(verifyOTP({ otp: passkey })).unwrap();
    dispatch(setOtp(true));
    setVerify(true);
    closeModal();
    
    }
    catch(e){
      console.log(e);
    }

 


  }


  

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog jakarta">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between text-white">
            Patient Records Access Verification
            <X
              className="cursor-pointer"
              onClick={() => {
                // dispatch(setLoading(false)),
                 closeModal();
              }}
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white">
            To access the Records, please enter the OTP.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="shad-primary-btn w-full"
          >
            Enter OTP
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
