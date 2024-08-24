

import { cn } from "@/lib/utils";
import React from "react";

import scheduled from "@/assets/check.svg"
import pending from "@/assets/pending.svg"
import cancelled from "@/assets/cancelled.svg"
export const StatusBadge = ({ status }) => {

    const StatusIcon = {
        scheduled: scheduled,
        pending: pending,
        cancelled: cancelled,
    };


  return (
    <div
      className={cn("status-badge", {
        "bg-green-600": status === "scheduled",
        "bg-blue-600": status === "pending",
        "bg-red-600": status === "cancelled",
      })}
    >
      <img
        src={StatusIcon[status]}
        alt="doctor"
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={cn("text-12-semibold capitalize", {
          "text-green-500": status === "scheduled",
          "text-blue-500": status === "pending",
          "text-red-500": status === "cancelled",
        })}
      >
        {status}
      </p>
    </div>
  );
};
