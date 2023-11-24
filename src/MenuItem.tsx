import { ChangeEvent } from 'react';
import './MenuItem.css';

function MenuItem(props: {
  title: string;
  min: number;
  max: number;
  callback: (e: ChangeEvent<HTMLInputElement>) => any;
  defaultValue?: number;
}) {
  const { title, min, max, defaultValue, callback } = props;

  return (
    <div className="form-group mb-2 w-100">
      <label htmlFor={title} className="sr-only">
        {title}
      </label>
      <input
        type="number"
        max={max}
        min={min}
        defaultValue={defaultValue || 0}
        onChange={callback}
        className="form-control"
      />
    </div>
  );
}

export default MenuItem;
