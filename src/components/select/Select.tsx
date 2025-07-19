import { ChangeEvent, FC } from "react";
import "./Select.scss";

type Props = {
  id?: string;
  name?: string;
  placeholder?: string;
  classnames?: string;
  options: { id: number; airport_name: string; airport_code: string }[];
  handleSelectChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
};

export const Select: FC<Props> = ({
  id,
  name,
  placeholder,
  classnames,
  options,
  handleSelectChange,
  value,
}) => {
  return (
    <select
      id={id}
      className={`select ${classnames ? classnames : ""}`}
      onChange={(event) => handleSelectChange(event)}
      {...(value !== undefined ? { value } : {})}
    >
      <option value="" disabled defaultValue={""}>
        {placeholder}
      </option>
      {options.map(({ airport_code, airport_name }) => (
        <option key={airport_code} value={airport_code}>
          {airport_name} ({airport_code})
        </option>
      ))}
    </select>
  );
};
