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
          className="w-1/3 h-10 text-sm"
          value={selected}
          options={dropDownOptions[optionsIndex]}
          optionLabel="label"
          optionValue="value"
          onChange={({ value }) => setSelected(value)}
        />
      <span>selected {selected}</span>
        </>

    );
}


