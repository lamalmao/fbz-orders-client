import moment from 'moment';
import './Orders.css';

export interface IOrder {
  orderID: number;
  client: number;
  status: string;
  itemTitle: string;
  manager: number;
  managerName: string;
  refundStatus: string;
  refundData: string;
  amount: number;
  key: string;
  platform: string;
  date: Date;
}

const OrderStatuses = new Map<string, string>([
  ['untaken', 'ожидает'],
  ['processing', 'в работе'],
  ['done', 'готов'],
  ['refund', 'возврат'],
  ['canceled', 'отменен'],
  ['delivered', 'доставлен']
]);

const RefundStatuses = new Map<string, string>([
  ['rejected', 'отказ'],
  ['approved', 'выполнен'],
  ['waiting', 'ожидает']
]);

export function convertOrders(
  orders: [IOrder]
): Array<IOrder & { namedStatus: string; stringDate: string }> {
  const result = orders as [
    IOrder & { namedStatus: string; stringDate: string }
  ];
  for (let i = 0; i < orders.length; i++) {
    result[i].refundStatus = RefundStatuses.get(orders[i].refundStatus) || '';
    result[i].namedStatus = OrderStatuses.get(orders[i].status) || '';
    result[i].key = orders[i].key || '';
    result[i].refundData = orders[i].refundData || '';
    result[i].stringDate = moment(result[i].date).format('DD-MM-YYYY HH:mm:ss');
  }

  return result;
}

function Orders(props: {
  orders?: ReturnType<typeof convertOrders>;
  total?: number;
}) {
  const { orders, total } = props;

  return (
    <div className="container-fluid orders">
      <p>Всего: {total || 0}</p>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">ID</th>
            <th scope="col">Клиент</th>
            <th scope="col">Менеджер</th>
            <th scope="col">Товар</th>
            <th scope="col">Цена</th>
            <th scope="col">Статус</th>
            <th scope="col">Дата и время</th>
            <th scope="col">Платформа</th>
            <th scope="col">Ключ/Карта</th>
            <th scope="col">Возврат</th>
            <th scope="col">Данные для возврата</th>
          </tr>
        </thead>
        <tbody>
          {orders
            ? orders.map((order, index) => (
                <tr key={index}>
                  <th scope="col">{index + 1}.</th>
                  <td className={order.status}>{order.orderID}</td>
                  <td className={order.status}>{order.client}</td>
                  <td className={order.status}>{order.managerName}</td>
                  <td className={order.status}>{order.itemTitle}</td>
                  <td className={order.status}>{order.amount}</td>
                  <td className={order.status}>{order.namedStatus}</td>
                  <td className={order.status}>{order.stringDate}</td>
                  <td className={order.status}>{order.platform}</td>
                  <td className={order.status}>{order.key}</td>
                  <td className={order.status}>{order.refundStatus}</td>
                  <td className={order.status}>{order.refundData}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
