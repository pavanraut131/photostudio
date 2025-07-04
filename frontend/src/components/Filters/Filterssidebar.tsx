import React from "react";
import "./filtersidebar.css";
import Filterthumbnail from "./Filterthumbnail";
import { useDispatch } from "react-redux";
import { setSelectedfilter } from "@/redux/Imageslice";

const filters = [
  { name: "Original", key: "original" },
  { name: "Tropical", key: "tropical" },
  { name: "Crisp", key: "crisp" },
  { name: "Sandy", key: "sandy" },
  { name: "Moody", key: "moody" },
  { name: "Black & White", key: "black-white" },
  { name: "Neon", key: "neon" },
  { name: "Washed", key: "washed" },
  { name: "Bright", key: "bright" },
  { name: "Mellow", key: "mellow" },
  { name: "Romantic", key: "romantic" },
  { name: "Newspaper", key: "newspaper" },
  { name: "Darken", key: "darken" },
  { name: "Lighten", key: "lighten" },
  { name: "Faded", key: "faded" },
  { name: "Unicorn", key: "unicorn" },
  { name: "Nightrain", key: "nightrain" },
  { name: "Neon Sky", key: "neon-sky" },
  { name: "Blue Ray", key: "blue-ray" },
  { name: "Jellybean", key: "jellybean" },
  { name: "Concrete", key: "concrete" },
];

interface FiltersSidebarProps {
  selectedfilters: string;
  previewImage?: string;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  selectedfilters,
  previewImage,
}) => {
  const dispatch = useDispatch()


    // const previewImage =
    //   "https://yavuzceliker.github.io/sample-images/image-1.jpg";

  const handlefilterkey=(filterkey:string)=>{
    dispatch(setSelectedfilter(filterkey))
  }

  return (
    <div className="main-sidebar">
      <h3>Color Filters</h3>
      <div className="filters-scroll-container">
        <div className="filters-grid">
          {filters.map((filter) => (
            <div
              key={filter.key}
              className={`filter-item ${
                selectedfilters === filter.key ? "selected" : ""
              }`}
              onClick={() => handlefilterkey(filter.key)}
            >
              <div className={`filter-thumbnail ${filter.key}`}>
                {previewImage ? (
                  <Filterthumbnail imageUrl={previewImage} filterKey ={filter.key}/>
                ) : (
                  <div className="filter-thumbnail-placeholder">
                    {filter.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="filter-name">{filter.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiltersSidebar;