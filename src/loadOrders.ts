import { IOrdersRequestData } from './App';
import { IOrder } from './Orders';

async function getOrders(
  params: IOrdersRequestData
): Promise<[IOrder] | string> {
  try {
    const response = await fetch('http://localhost:5000/orders/get', {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params),
      method: 'post'
    });

    switch (response.status) {
      case 500:
        const err = await response.json();
        console.log(err);
        throw new Error('Внутренняя ошибка сервера');
      case 401:
        throw new Error('Доступ запрещен');
    }

    const orders = (await response.json()) as {
      data: [IOrder];
      count: number;
    };
    return orders.data;
  } catch (error) {
    console.log(error);
    return (error as Error).message || 'Неизвестная ошибка';
  }
}

export default getOrders;
