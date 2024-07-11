import { useState } from "react";
import { Dropdown } from "primereact/dropdown";

export default function SelectOption() {
    const [selected, setSelected] = useState(0);
    const [optionsIndex, setOptionsIndex] = useState(0);

    const dropDownOptions = [
        [
          { label: "Option 1", value: 1 },
          { label: "Option 2", value: 2 }
        ],
      ];

    return(
        <>
        <Dropdown
          className="w-full h-10 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={selected}
          options={dropDownOptions[optionsIndex]}
          optionLabel="label"
          optionValue="value"
          onChange={({ value }) => setSelected(value)}
        />
        </>

    );
}


