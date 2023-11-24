import { ChangeEvent, MouseEvent } from 'react';
import './Menu.css';
import MenuItem from './MenuItem';

function Menu(props: {
  yearHandler: (e: ChangeEvent<HTMLInputElement>) => any;
  monthHandler: (e: ChangeEvent<HTMLInputElement>) => any;
  limitHandler: (e: ChangeEvent<HTMLInputElement>) => any;
  refreshHandler: (e: MouseEvent<HTMLInputElement>) => any;
  managersFilter: (e: MouseEvent<HTMLButtonElement>) => any;
  dropManagersFilter: (e: MouseEvent<HTMLButtonElement>) => any;
  findOrder: (e: MouseEvent<HTMLButtonElement>) => any;
  dropOrderFilter: (e: MouseEvent<HTMLButtonElement>) => any;
  findByClientID: (e: MouseEvent<HTMLButtonElement>) => any;
  dropClientIdFilter: (e: MouseEvent<HTMLButtonElement>) => any;
  switchUpdate: (e: ChangeEvent<HTMLInputElement>) => any;
  loading: boolean;
  managers?: Set<String>;
  chosenManager?: string;
}) {
  const {
    yearHandler,
    monthHandler,
    limitHandler,
    refreshHandler,
    managersFilter,
    dropManagersFilter,
    findOrder,
    dropOrderFilter,
    findByClientID,
    dropClientIdFilter,
    switchUpdate,
    loading,
    managers,
    chosenManager
  } = props;
  const now = new Date();

  return (
    <div className="row align-items-start">
      <div className="col">
        <form className="form">
          <MenuItem
            title="Месяц"
            min={1}
            max={12}
            defaultValue={now.getMonth() + 1}
            callback={monthHandler}
          ></MenuItem>
          <MenuItem
            title="Год"
            min={2020}
            max={2030}
            defaultValue={now.getFullYear()}
            callback={yearHandler}
          ></MenuItem>
          <MenuItem
            title="Лимит"
            min={0}
            max={100000}
            defaultValue={500}
            callback={limitHandler}
          ></MenuItem>
          <input
            type="button"
            onClick={refreshHandler}
            value="Загрузить"
            disabled={loading}
            className="btn btn-primary"
          />
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="autoUpdateCheckbox"
              defaultChecked={true}
              onChange={switchUpdate}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Автоматически обновлять таблицу
            </label>
          </div>

          {loading ? (
            <img src="loading.gif" className="loading" alt="loading..." />
          ) : null}
        </form>
      </div>
      <div className="col">
        <form className="form-inline">
          <div className="form-group">
            <label htmlFor="managers" className="sr-only">
              Поиск по {chosenManager || 'менеджерам'}
            </label>
            <div className="dropdown">
              <button
                type="button"
                className="btn btn-secondary dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                список
              </button>
              <div className="dropdown-menu">
                {managers
                  ? [...managers].map((manager, index) =>
                      manager !== '-' ? (
                        <button
                          type="button"
                          className="dropdown-item"
                          key={index}
                          onClick={managersFilter}
                        >
                          {manager}
                        </button>
                      ) : null
                    )
                  : null}
              </div>
              <button
                className="btn btn-danger reset-managers"
                type="button"
                onClick={dropManagersFilter}
              >
                &#10006;
              </button>
            </div>
          </div>
          <div className="form-group mb-3 w-50 input-group margin">
            <input
              type="text"
              className="form-control"
              aria-label="order id"
              placeholder="Поиск по номеру заказа"
              id="orderIdSearch"
            />
            <div className="input-group-append">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={findOrder}
              >
                Найти
              </button>
              <button
                className="btn btn-danger btn-secondary"
                type="button"
                onClick={dropOrderFilter}
              >
                &#10006;
              </button>
            </div>
          </div>
          <div className="form-group mb-3 w-50 input-group margin">
            <input
              type="text"
              className="form-control"
              aria-label="client id"
              placeholder="Поиск по ID клиента"
              id="clientIdSearch"
            />
            <div className="input-group-append">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={findByClientID}
              >
                Найти
              </button>
              <button
                className="btn btn-danger btn-secondary"
                type="button"
                onClick={dropClientIdFilter}
              >
                &#10006;
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Menu;
