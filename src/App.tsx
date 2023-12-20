import { useState } from 'react';
import './App.css';
import Menu from './Menu';
import getOrders from './loadOrders';
import { convertOrders } from './Orders';
import Orders from './Orders';
import cloneDeep from 'lodash/cloneDeep';

export interface IOrdersRequestData {
  user: string;
  params: {
    year: number;
    month: number;
    limit?: number;
  };
}

const statuses = new Map([
  ['Ожидает', 'untaken'],
  ['В работе', 'processing'],
  ['Отменён', 'canceled'],
  ['Возврат', 'refund'],
  ['Выполнен', 'done']
]);

function App() {
  const url = new URL(document.location.href);
  const user: string = (url.searchParams.get('u') as string | undefined) || '';
  const now = new Date();
  let refreshStarted = false;

  const [chosenManager, setChosenManager] = useState<string | undefined>(
    undefined
  );

  const [chosenStatus, setChosenStatus] = useState<string | undefined>(
    undefined
  );

  const refreshData = async () => {
    switchLoading(true);
    const orders = await getOrders(requestData);
    switchLoading(false);
    if (typeof orders === 'string') {
      alert(orders);
      return;
    }

    const managers: Set<string> = new Set();
    orders.map(order => managers.add(order.managerName));
    setManagers(managers);

    const preparedOrders = convertOrders(orders);
    setOrders(preparedOrders);
    setDisplayOrders(cloneDeep(preparedOrders));
    setChosenManager(undefined);
  };

  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const [managers, setManagers] = useState<Set<string>>(new Set());
  const [loading, switchLoading] = useState<boolean>(false);
  const [loadedOrders, setOrders] =
    useState<ReturnType<typeof convertOrders>>();
  const [displayOrders, setDisplayOrders] =
    useState<ReturnType<typeof convertOrders>>();
  const [requestData, setRequestData] = useState<IOrdersRequestData>({
    user,
    params: {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      limit: 500
    }
  });

  return (
    <div className="App container-fluid">
      <Menu
        limitHandler={e => {
          const copy = Object.assign({}, requestData);
          const limit = Number(e.target.value);
          if (Number.isNaN(limit)) {
            return;
          }

          copy.params.limit = limit !== 0 ? limit : undefined;
          setRequestData(copy);
        }}
        monthHandler={e => {
          const copy = Object.assign({}, requestData);
          const month = Number(e.target.value);
          if (Number.isNaN(month)) {
            return;
          }

          copy.params.month = month;
          setRequestData(copy);
        }}
        statusFilter={e => {
          if (!loadedOrders) return;

          const status = statuses.get(e.currentTarget.innerText);
          if (!status) {
            return;
          }

          const newDisplay = loadedOrders.filter(
            order => order.status === status
          );

          if (newDisplay) {
            setDisplayOrders(newDisplay);
            setChosenStatus(e.currentTarget.innerText);
          }
        }}
        chosenStatus={chosenStatus}
        dropStatusFilter={() => {
          setDisplayOrders(cloneDeep(loadedOrders));
          setChosenStatus(undefined);
        }}
        yearHandler={e => {
          const copy = Object.assign({}, requestData);
          const year = Number(e.target.value);
          if (Number.isNaN(year)) {
            return;
          }

          copy.params.year = year;
          setRequestData(copy);
        }}
        refreshHandler={async () => {
          await refreshData();

          if (!refreshStarted) {
            refreshStarted = true;
            setInterval(async () => {
              if (autoUpdate) {
                await refreshData();
              }
            }, 7000);
          }
        }}
        managersFilter={e => {
          if (!loadedOrders) return;

          const manager = e.currentTarget.innerText;
          const newDisplay = loadedOrders.filter(
            m => m.managerName === manager
          );

          if (newDisplay) {
            setDisplayOrders(newDisplay);
            setChosenManager(manager);
          }
        }}
        dropManagersFilter={() => {
          setDisplayOrders(cloneDeep(loadedOrders));
          setChosenManager(undefined);
        }}
        findOrder={() => {
          if (!loadedOrders) return;
          const element = document.getElementById(
            'orderIdSearch'
          ) as HTMLInputElement;

          const orderId = Number(element.value);
          if (Number.isNaN(orderId)) return;

          const filteredOrders = loadedOrders.filter(
            order => order.orderID === orderId
          );

          element.value = '';
          setDisplayOrders(filteredOrders);
        }}
        dropOrderFilter={() => setDisplayOrders(cloneDeep(loadedOrders))}
        findByClientID={() => {
          if (!loadedOrders) return;
          const element = document.getElementById(
            'clientIdSearch'
          ) as HTMLInputElement;

          const clientId = Number(element.value);
          if (Number.isNaN(clientId)) return;

          const filteredOrders = loadedOrders.filter(
            order => order.client === clientId
          );

          element.value = '';
          setDisplayOrders(filteredOrders);
        }}
        dropClientIdFilter={() => setDisplayOrders(cloneDeep(loadedOrders))}
        loading={loading}
        managers={managers}
        chosenManager={chosenManager}
        switchUpdate={e => setAutoUpdate(e.target.checked)}
      ></Menu>{' '}
      <hr />
      <div className="row">
        <Orders
          orders={displayOrders}
          total={displayOrders ? displayOrders.length : 0}
        ></Orders>
      </div>
    </div>
  );
}

export default App;
