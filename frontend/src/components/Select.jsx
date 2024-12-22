"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { getSearch, setSearch } from "@/lib/store/UserSlice";
import { debounce } from "lodash";

const handleSearchChange = debounce((value, dispatch) => {
  dispatch(setSearch(value));
}, 300);

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-11 w-full items-center data-[state=checked]:text-green-400 justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:border-slate-800  dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300",
        className
      )}
      {...rest}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center ",
        className
      )}
      {...rest}
    >
      <ChevronUp className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
});
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-center ",
        className
      )}
      {...rest}
    >
      <ChevronDown className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
});
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef((props, ref) => {

  const [search, setSearh] = React.useState("pop");
  const dispatch = useDispatch();
  
  const { className, children, position = "popper", ...rest } = props;
  return (
    <SelectPrimitive.Portal>

      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          " z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[state=selected]:text-green-400 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...rest}
      >
      {/* <input placeholder="Search Doctors"  className=" flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none bg-transparent  focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50"
            onChange={(e) => handleSearchChange(e.target.value, dispatch)} // Debounced update
            /> */}

        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}

        >
          {children}

        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn("py-1.5 pl-8 pr-2 text-sm ", className)}
      {...rest}
    />
  );
});
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef((props, ref) => {
  const { className, children, ...rest } = props;

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex  group w-full  select-none cursor-pointer  data-[state=checked]:text-green-400  items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none   focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50   dark:focus:text-white",
        className
      )}
      {...rest}
    >
      <span className="absolute left-2 flex size-3.5 py-7  items-center justify-center ">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>
        <p className="">

        {children}
        </p>
        </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <SelectPrimitive.Separator
    ref={ref}
    className={cn("h-px ", className)} // Added bg-green-500 for green separator
    {...rest}
  />
  );
});
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
