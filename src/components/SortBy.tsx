"use client";

import { useRouter, useSearchParams } from "next/navigation";

const sortingOptions = [
  { value: "price-asc", label: "Sort by price(asc)" },
  { value: "price-desc", label: "Sort by price(desc)" },
  { value: "created_at-asc", label: "Sort by created at(asc)" },
  { value: "created_at-desc", label: "Sort by created at(desc)" },
  { value: "rating-asc", label: "Sort by rating (asc)" },
  { value: "rating-desc", label: "Sort by rating (desc)" },
];

function SortBy({page, pagesize, getproducts} : any) {
  const router = useRouter();
  const params = useSearchParams();
  const searchParams = new URLSearchParams(params);

  async function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sortBy = e.target.value;
    const newSearchParams = new URLSearchParams(searchParams);
    if (sortBy) {
      newSearchParams.set("sortBy", sortBy);
    } else {
      newSearchParams.delete("sortBy");
    }
    router.push(`?${newSearchParams.toString()}`);
   await  getproducts(page, pagesize, sortBy);
  }

  return (
    <div className="text-black flex gap-2">
      <p className="text-white text-lg">Sort By</p>
      <select
        name="sorting"
        id="sorting"
        value={String(searchParams.get("sortBy"))}
        onChange={(e) => {
          handleSortChange(e);
          // getproducts(page, pagesize, e.target.value);
        }}
      >
        <option value="">None</option>
        {sortingOptions.map((option, i) => {
          return (
            <option key={i} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default SortBy;
