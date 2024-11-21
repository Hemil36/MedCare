
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import {
  Delete,
  DeleteIcon,
  Download,
  Eye,
  Loader,
  Plus,
  Trash2,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { onUpload } from "@/forms/fileUploader";
import { Input } from "@/components/ui/input";
import AxiosPrivate from "@/hooks/AxiosPrivate";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getpatientID, getRecords, setRecords } from "@/lib/store/UserSlice";
import { handleSubmit } from "@/lib/store/AsyncThunks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";





const UserRecord = () => {
  // console.log(document.cookie)
  console.log("UserRecord");

  const [open, setOpen] = useState(false);
  const [file, setFile] = React.useState(null);
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("Required");
  const [recordName, setRecordName] = React.useState("");
  const [upload, setUpload] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [uploadLoading, setUploadLoading] = React.useState(false);

  const axios = AxiosPrivate();
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

  const records = useSelector(getRecords,shallowEqual);
  const dispatch = useDispatch();
  
  const getRecords2 = useCallback(async () => {
    if(records!=null && load == false)
      return ;

    const { data } = await axios.post("/api/getRecords", {
      patientID: patientID,
    });
    dispatch(setRecords(data.filteredFiles));
  }, [patientID]);


  useEffect(() => {
    getRecords2();
  }, [load]); 

  const delete1 = async (fileid) => {
    const t = await axios.post(`/api/delete`, { fileId: fileid });
    if (t.status === 200) {
      setLoad((state) => !state);
      toast({
        title: "Record Deleted",
      });

      const newRecords = records.filter((record) => record.$id !== fileid);
      dispatch(setRecords(newRecords));
    }
    console.log(t);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div className="w-full h-full overflow-hidden pt-7 mx-auto px-4 ">
      <h1 className=" text-3xl font-bold overflow-hidden remove-scrollbar container   ">Reports</h1>
      <ScrollArea className="h-full w-auto">
        {records ? (
          <>
            {" "}
            <div className="pt-5 container">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="p-4 bg-green-500 mb-2  ">
                    <Plus /> Add Reports
                  </Button>
                </DialogTrigger>
                <DialogContent className="shad-dialog sm:max-w-md text-white jakarta">
                  <form
                    onSubmit={async (e) => {
                      setUploadLoading(true);
                      await handleSubmit(
                        e,
                        upload,
                        patientID,
                        recordName,
                        setError,
                        setLoad,
                        setOpen
                      );
                      setOpen(false);
                      setUploadLoading(false);
                      setLoad(false);
                      setFile(null);
                    }}
                  >
                    <DialogHeader className="mb-4 space-y-3">
                      <DialogTitle className="capitalize">
                        {" "}
                        Create Record
                      </DialogTitle>
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

                          if (e.target.files[0].size > 10000000) {
                            setError("File size should be less than 10MB");
                            return;
                          }
                          if (
                            e.target.files[0].type === "image/png" ||
                            e.target.files[0].type === "image/jpeg" ||
                            e.target.files[0].type === "application/pdf"
                          ) {
                            if (
                              e.target.files[0].type === "image/png" ||
                              e.target.files[0].type === "image/jpeg"
                            ) {
                              const t = await onUpload(e);
                              setError("");
                              setFile(t);
                              setName("");
                              console.log(t);
                            } else {
                              setName(e.target.files[0].name);
                              setError("");
                              setFile("im");
                            }
                            return;
                          } else {
                            setError("File type should be png, jpeg or pdf");
                            return;
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
                            <span className="text-green-500">
                              Click to upload{" "}
                            </span>
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
                      <Input
                        required
                        className="shad-input"
                        placeholder="RecordName"
                        onChange={(e) => setRecordName(e.target.value)}
                      />
                    </div>

                    <Button
                      className="mt-4 bg-green-500 text-center w-full"
                      type="submit"
                    >
                      {uploadLoading ? (
                        <Loader className="animate-spin h-5 w-5 " />
                      ) : (
                        <p>Upload</p>
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {records.map((record) => {
                  const date = new Date(record.$createdAt);
                  const previewHref = `https://cloud.appwrite.io/v1/storage/buckets/Image/files/${record.$id}/view?project=66a12c91000a4cded686`;
                  const downloadHref = `https://cloud.appwrite.io/v1/storage/buckets/Image/files/${record.$id}/download?project=66a12c91000a4cded686`;

                  return (
                    <Card
                      key={record.$id}
                      className="w-full hover:shadow-lg transition-all duration-300 group"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle
                          className="text-lg font-semibold leading-tight truncate group-hover:text-primary transition-colors"
                          title={record.name}
                        >
                          
                          {
                           

                          record.name.slice(15, record.name.length-4) 
                          }
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {date.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </CardHeader>
                      <CardContent className="pb-2 overflow-hidden">
                        <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center  overflow-hidden group-hover:opacity-90 transition-opacity">
                          {record.mimeType != "application/pdf" ? (
                            <img
                              src={previewHref}
                              alt={`Preview of ${record.name}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <iframe
                              src={previewHref}
                              scrolling="no"
                              className=" h-full remove-scrollbar"
                              style={{ overflow: "hidden" }}
                            />
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="hover:text-primary transition-colors"
                              >
                                <a
                                  href={previewHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Eye className="h-5 w-5" />
                                  <span className="sr-only">Preview</span>
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Preview</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="hover:text-primary transition-colors"
                              >
                                <a
                                  href={downloadHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Download className="h-5 w-5" />
                                  <span className="sr-only">Download</span>
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => delete1(record.$id)}
                                className="hover:text-destructive transition-colors"
                              >
                                <Trash2 className="h-5 w-5" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className=" h-full w-full relative">
              <Loader className="animate-spin h-10 w-10 absolute top-1/3 right-1/2" />
            </div>
          </>
        )}
      </ScrollArea>
    </div>
  );
};

export default UserRecord;
