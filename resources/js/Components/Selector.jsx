import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'


export default function Selector({data,selected,setSelected}) {
  const [query, setQuery] = useState('')

  const filtered =
    query === ''
      ? data
      : data.filter((doc) =>
          doc.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )
  return (
    <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
        <div className="flex w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
            className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none outline-none focus:ring-0"
            displayValue={(doc) => doc.name}
            onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
                className="w-5 h-5 text-gray-400 hover:text-gray-600"
                aria-hidden="true"
            />
            </Combobox.Button>
        </div>
        <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
        >
            <Combobox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filtered.length === 0 && query !== '' ? (
                <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                Nothing found.
                </div>
            ) : (
                filtered.map((doc) => (
                <Combobox.Option
                    key={doc.id}
                    className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-sky-600 text-white' : 'text-gray-900'
                    }`
                    }
                    value={doc}>
                    {({ selected, active }) => (
                    <>
                        <span
                        className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                        }`}
                        >
                        {doc.name}
                        </span>
                        {selected ? (
                        <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-teal-600'
                            }`}
                        >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                        ) : null}
                    </>
                    )}
                </Combobox.Option>
                ))
            )}
            </Combobox.Options>
        </Transition>
        </div>
  </Combobox>
  )
}
