import { Select, Option } from "@material-tailwind/react";

export function SelectStatus({ value, setValue, disabled }) {
  const handleChange = (selectedValue) => {
    setValue(selectedValue);
  };

  return (
    <div className="w-72">
      <Select
        label="Select Status"
        animate={{
          mount: { y: 0 },
          unmount: { y: 25 },
        }}
        value={value}
        onChange={(val) => {
            handleChange(val)
        }}
        disabled={disabled}
      >
        <Option value="Pending">Pending</Option>
        <Option value="In Progress">In Progress</Option>
        <Option value="Resolved">Resolved</Option>
        <Option value="Closed">Closed</Option>
      </Select>
    </div>
  );
}