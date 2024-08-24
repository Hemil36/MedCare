import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Delete, DeleteIcon, Download, Eye, Loader, Plus, Trash2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { onUpload } from "@/forms/fileUploader";
import { Input } from "@/components/ui/input";
import AxiosPrivate from "@/hooks/AxiosPrivate";
import { useSelector } from "react-redux";
import { getpatientID } from "@/lib/store/UserSlice";
import { handleSubmit } from "@/lib/store/AsyncThunks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

const UserRecord = () => {

  // console.log(document.cookie)


  const [open, setOpen] = useState(false);
  const [file, setFile] = React.useState(null);
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("Required");
  const [recordName , setRecordName] = React.useState("")
  const [upload , setUpload] = React.useState(false)  
  const [records , setRecords] = React.useState(null)
  const [load,setLoad ] = React.useState(false)
   
    const axios = AxiosPrivate();
  console.log(name);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
const patientID = useSelector(getpatientID);


  useEffect(() => {
    const getRecords = async () => {
      const { data } = await axios.post("/api/getRecords", {
        patientID: patientID,
      });
      console.log(data);
      setRecords(data.filteredFiles);
    };
    getRecords();
  },[load])


  const delete1 = async(fileid) =>{

  
    const t = await axios.post(`/api/delete`,{fileId : fileid})
    if(t.status === 200){
      setLoad(state=>!state)
      toast({
        title: "Record Deleted"
      })
    }
    console.log(t)

  }

  

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div className="w-full h-full overflow-hidden ">
      <h1 className=" text-4xl font-bold ">Reports</h1>
      {records ?
      <> <div className="pt-5">

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="p-4 bg-green-500 ">
            <Plus /> Add Reports
          </Button>
        </DialogTrigger>
        <DialogContent className="shad-dialog sm:max-w-md text-white jakarta">
        <form onSubmit={(e)=>handleSubmit(e,upload,patientID,recordName ,setError , setLoad , setOpen)}>

          <DialogHeader className="mb-4 space-y-3">
            <DialogTitle className="capitalize"> Create Record</DialogTitle>
            <DialogDescription>
              Please upload your medical record
            </DialogDescription>
          </DialogHeader>
          <div {...getRootProps()} className="file-upload w-full">
            <input
            id="file"
            required
              {...getInputProps()}
              onChange={async (e) => {
                console.log(e.target.files[0]);
                setUpload(e.target.files[0]);

                  if(e.target.files[0].size > 10000000 ){
                      setError("File size should be less than 10MB")
                      return
                  }
                  if( e.target.files[0].type === "image/png" || e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "application/pdf" ){

                      if (
                        e.target.files[0].type === "image/png" ||
                        e.target.files[0].type === "image/jpeg"
                      ) {
                        const t = await onUpload(e);
                        setError("")
                        setFile(t);
                        setName("")
                        console.log(t);

                      } else {
                        setName(e.target.files[0].name);
                        setError("")
                        setFile("im");
                      }
                      return
                  }else{
                      setError("File type should be png, jpeg or pdf")
                      return
                  }

              }}
              type="file"
            />
           <p className="text-red-700">{error}</p> 

            {file ? (
              !name ? (
                <img
                  src={file}
                  height={100}
                  width={100}
                  onError="this.style.display='none'"
                  className=" overflow-hidden text-xl text-nowrap font-bold"
                />
              ) : (
                <span className="text-md font-bold">{name}</span>
              )
            ) : (
              <div className="file-upload_label text-center">
                <p className="text-14-regular ">
                  <span className="text-green-500">Click to upload </span>
                  or drag and drop
                </p>
                <p className="text-12-regular">
                  SVG, PNG, pdf (max. 10Mb)
                </p>
              </div>
            )}
          </div>
          <div className="grid-cols-3 pt-3">
              <DialogHeader>Record Name</DialogHeader>
              <Input required className="shad-input" placeholder="RecordName" onChange={(e)=>setRecordName(e.target.value)} />

          </div>
          <Button className="mt-4 bg-green-500 text-center w-full" type='submit' >Upload</Button>
          </form>

        </DialogContent>
      </Dialog>
    </div>

    <div className=" flex items-center pt-10 h-full   ">
      <ScrollArea className="h-full w-full rounded-md  p-4">

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xl">Record</TableHead>
            <TableHead className="w-full text-xl">Date</TableHead>
            <TableHead className="text-xl">Preview</TableHead>
            <TableHead className="w-full text-xl">Download</TableHead>
            <TableHead className="w-full text-xl">Delete</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {

            records && records.map((record) => {
              const date = new Date(record.$createdAt);
              const href=`https://cloud.appwrite.io/v1/storage/buckets/Image/files/${record.$id}/view?project=66a12c91000a4cded686`
              const href1=`https://cloud.appwrite.io/v1/storage/buckets/Image/files/${record.$id}/download?project=66a12c91000a4cded686`

              return (

                <TableRow key={record.name} className="py-2">
                  <TableCell className="text-nowrap">{record.name.slice(15,45)}</TableCell>
                  <TableCell className="text-nowrap">{date.toDateString()}</TableCell>
                  <TableCell><a href={href} target="_blank" ><Button ><Eye className=" hover:bg-green-400 rounded-md " /></Button></a></TableCell>
                  <TableCell><a href={href1} target="_blank" ><Button ><Download className=" hover:bg-green-400 rounded-md " /></Button></a></TableCell>
                  <TableCell><Button onClick={(e)=>{delete1(record.$id)}} ><Trash2 className=" hover:bg-green-400 rounded-md " /></Button></TableCell>

                </TableRow>
              );
            })
          }
         
        </TableBody>
      </Table>
      </ScrollArea>

    </div></>:<>
    
          <div className=" h-full w-full relative">
            <Loader className="animate-spin h-10 w-10 absolute top-1/3 right-1/2" />
          </div>
    </>
      }
     

    </div>
  );
};

export default UserRecord;
