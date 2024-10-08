import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Path } from "../../../utils";
import { Add, Close } from "@mui/icons-material";
import { Chip, FormControl, Input, InputAdornment, Tooltip } from "@mui/material";
import { FiFilter } from "react-icons/fi";
import FilterDrawer from "./Filter";
import { PiMagnifyingGlass } from "react-icons/pi";

const Topbar = ({ isFiltered, setIsFiltered, search, setSearch }) => {

  //////////////////////////////////////////// VARIABLES //////////////////////////////////////////////////// 
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = pathname.split("/")[1];
  const pathArr = pathname.split("/").filter((item) => item != "");
  const showAddButton = !pathArr.includes("create");

  //////////////////////////////////////////// STATES //////////////////////////////////////////////////// 
  const [openFilters, setOpenFilters] = useState(false);

  //////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////// 

  //////////////////////////////////////////// FUNCTIONS//////////////////////////////////////////////////// 
  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
  }

  return (
    <div className="flex flex-col mb-6">
      <div className="w-full text-[14px] ">
        <Path />
      </div>

      <div className="sm:flex justify-between items-center flex-none">
        <h1 className="text-primary-blue text-[32px] capitalize font-light">Approvals</h1>

        {showAddButton && (
          <div className="flex items-center justify-end gap-2 md:mt-0 mt-4">
            {
              isFiltered &&
              <Chip
                label="Filtered"
                onDelete={() => setIsFiltered(false)}
                deleteIcon={<Close />}
              />
            }
            <div className="bg-[#ebf2f5] hover:bg-[#dfe6e8] p-1 pl-2 pr-2 rounded-md w-48">
              <FormControl>
                <Input
                  name="search"
                  value={search}
                  placeholder="Search Requests"
                  onChange={(e) => handleSearch(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <PiMagnifyingGlass className="text-[25px]" />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
          </div>
        )}
      </div>
      <FilterDrawer open={openFilters} setOpen={setOpenFilters} isFiltered={isFiltered} setIsFiltered={setIsFiltered} />
    </div>
  );
};

export default Topbar;
