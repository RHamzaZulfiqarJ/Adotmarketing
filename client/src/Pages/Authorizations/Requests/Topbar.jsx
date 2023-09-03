import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Path } from "../../../utils";
import { Add } from "@mui/icons-material";
import { FormControl, Input, InputAdornment, TextField, Tooltip } from "@mui/material";
import { FiFilter } from "react-icons/fi";
import FilterDrawer from "./Filter";
import { PiMagnifyingGlass } from "react-icons/pi";

const Topbar = (view, setView) => {

  const [openFilters, setOpenFilters] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = pathname.split("/")[1];
  const pathArr = pathname.split("/").filter((item) => item !== "");
  const showAddButton = !pathArr.includes("create");

  const handleAddClick = () => {
    navigate(`${pathname}/create`);
  };

  const handleToggleFilters = () => {
    setOpenFilters((pre) => !pre);
  };

  return (
    <div className="flex flex-col ">
      <div className="w-full text-[14px] ">
        <Path />
      </div>

      <div className="sm:flex justify-between items-center flex-none">
        <h1 className="text-primary-blue text-[32px] capitalize">{title}</h1>

        {showAddButton && (
          <div className="flex items-center justify-end gap-2 md:mt-0 mt-4">
            <div className="bg-[#ebf2f5] hover:bg-[#dfe6e8]  rounded-md w-48">
              <FormControl>
                <TextField
                size="small"
                fullWidth
                  name="search"
                  placeholder="Search Requests"
                  variant="outlined"
                  onChange={(e) => handleSearch(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <PiMagnifyingGlass className="text-[25px]" />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
            <Tooltip title="Filter" arrow placement="top">
              <div
                onClick={handleToggleFilters}
                className={` p-2 rounded-md cursor-pointer ${
                  openFilters
                    ? "text-[#20aee3] bg-[#e4f1ff]"
                    : "bg-[#ebf2f5] hover:bg-[#dfe6e8] text-[#a6b5bd]"
                }`}>
                <FiFilter className="text-[25px] " />
              </div>
            </Tooltip>
          </div>
        )}
      </div>
      <FilterDrawer open={openFilters} setOpen={setOpenFilters} />
    </div>
  );
};

export default Topbar;
