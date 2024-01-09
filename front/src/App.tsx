import { useState } from 'react';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { OrderPartial } from './models';
import { GET_ACTIVE_ORDER } from './graphql/queries';
import { useQuery } from './client';

function App() {
  const [activeOrder, setActiveOrder] = useState<OrderPartial>({} as OrderPartial);
  const { data, loading, error } = useQuery(GET_ACTIVE_ORDER);

  if (data?.activeOrder && !activeOrder) {
    setActiveOrder(data.activeOrder);
  }

  return (
    <>
      <Header activeOrder={activeOrder}></Header>
      <div>
        <ProductList setActiveOrder={setActiveOrder}></ProductList>
      </div>
    </>
  );
}

export default App;
