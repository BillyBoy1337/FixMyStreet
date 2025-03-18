import { Select, Option } from "@material-tailwind/react";

export function SelectCategory({ value, setValue, disabled }) {
  const handleChange = (selectedValue) => {
    setValue(selectedValue);
  };

  return (
    <div className="w-72">
      <Select
        label="Select Category"
        animate={{
          mount: { y: 0 },
          unmount: { y: 25 },
        }}
        value={value}
        onChange={(val) => handleChange(val)}
        disabled={disabled}
      >
        <Option value="Road Issues">Road Issues</Option>
        <Option value="Waste Management">Waste Management</Option>
        <Option value="Water Supply">Water Supply</Option>
        <Option value="Electricity">Electricity</Option>
        <Option value="Public Safety">Public Safety</Option>
        <Option value="Environmental Concerns">Environmental Concerns</Option>
        <Option value="Public Transport">Public Transport</Option>
        <Option value="Street Lighting">Street Lighting</Option>
        <Option value="Noise Pollution">Noise Pollution</Option>
        <Option value="Other">Other</Option>
      </Select>
    </div>
  );
}