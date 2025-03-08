import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { getAppointment, getAppointmentDetails } from "@/lib/store/AsyncThunks";
import { getDoctorID } from "@/lib/store/UserSlice";
export function DataTable({ columns, data }) {
  const [sorting, setSorting] = React.useState([]);
  const [filtering, setFiltering] = React.useState([]);

  const [data4, setData4] = React.useState([]);
  const dispatch = useDispatch();
  const doctorID = useSelector(getDoctorID)
  
  useEffect(() => {
    
    
    const t = async () => {

      try{
  const {payload}=  await dispatch(getAppointment({ doctorID }));
let data = payload.data;
      const data2 = data?.filter((d) => d != null);
      const sortedAppointments = data
        .filter((d) => d != null) // Keep only future or current appointments
        .sort((a, b) => {
          // Sort by date first
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          if (dateA.getTime() === dateB.getTime()) {
            // If dates are the same, sort by status priority
            const statusPriority = {
              scheduled: 1,
              pending: 2,
              completed: 3,
              cancelled: 4,
            };
            return (
              statusPriority[a.status] -
              statusPriority[b.status]
            );
          } else {
            return dateA - dateB; // Sort by date
          }
        });
        setFiltering(sortedAppointments);
      }
      catch(e){
        console.log(e);
      }
    };


    t();

  }, []);

  console.log(filtering, "filtering");
  // console.log(data, "data");


  const table = useReactTable({
    data: filtering,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      sorting: [{ id: "schedule", desc: true }],
    },
  });

  return (
    <div className="rounded-md border data-table remove-scrollbar">
      <Table className="shad-table">
        <TableHeader className="shad-table-row-header">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="shad-table-row">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              if (
                row.original.status === "completed" ||
                row.original.status === "cancelled"
              )
                return;

              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="table-actions">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="shad-gray-btn"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="shad-gray-btn"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
