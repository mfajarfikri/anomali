export default function Selectbox({ className = '',options,currentValue, ...props }) {
    return  (
      <select 
        {...props}
        defaultValue={currentValue}
        className={
            'border-gray-400 text-indigo-400 focus:ring-indigo-400 rounded-md shadow-sm mt-1 block w-full' +
            className
        }
       >
        {options.map((option,index) =>(
            <option key={index} value={option.value}>
                {option.label}
            </option>
        ))}
        
      </select>
    );
   
}
