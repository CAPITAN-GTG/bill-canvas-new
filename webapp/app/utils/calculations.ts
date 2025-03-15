import { Connection } from '../components/boxes/BaseBox';

interface BoxData {
  id: string;
  type: 'bill' | 'income' | 'investment' | 'total';
  value: string;
  investmentReturn?: string;
}

const findConnectedBoxes = (
  totalBoxId: string,
  boxes: BoxData[],
  connections: Connection[]
): Set<string> => {
  const connectedBoxes = new Set<string>([totalBoxId]);
  let hasNewConnections = true;

  // Keep looking for new connections until no new boxes are found
  while (hasNewConnections) {
    hasNewConnections = false;
    connections.forEach(conn => {
      if (connectedBoxes.has(conn.from) && !connectedBoxes.has(conn.to)) {
        connectedBoxes.add(conn.to);
        hasNewConnections = true;
      }
      if (connectedBoxes.has(conn.to) && !connectedBoxes.has(conn.from)) {
        connectedBoxes.add(conn.from);
        hasNewConnections = true;
      }
    });
  }

  return connectedBoxes;
};

export const calculateTotals = (boxes: BoxData[], connections: Connection[]) => {
  let total = 0;
  let totalInvestments = 0;
  let investmentReturns = 0;

  // Find the total box
  const totalBox = boxes.find(box => box.type === 'total');
  if (!totalBox) {
    return { total, totalInvestments, investmentReturns };
  }

  // Get all boxes connected to the total box
  const connectedBoxes = findConnectedBoxes(totalBox.id, boxes, connections);

  // Only process boxes that are connected to the total box
  boxes.forEach(box => {
    if (connectedBoxes.has(box.id) && box.type !== 'total') {
      const value = parseFloat(box.value.replace('$', '').replace(',', '')) || 0;

      if (box.type === 'income') {
        total += value;
      } else if (box.type === 'bill') {
        total -= value;
      } else if (box.type === 'investment') {
        total -= value;
        totalInvestments += value;
        const returnRate = parseFloat(box.investmentReturn || '0') || 0;
        investmentReturns += (value * returnRate) / 100;
      }
    }
  });

  return {
    total,
    totalInvestments,
    investmentReturns
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}; 