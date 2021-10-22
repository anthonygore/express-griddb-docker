const griddb = require('griddb_node');

const putRow = (container) => async (val) => {
  try {
    const p = 1000;
    const now = new Date();
    const time = new Date(Math.round(now.getTime() / p ) * p);
    await container.put([time, val]);
  } catch (err) {
    console.log(err);
  }
}

const getLatestRows = (container) => async () => {
  try {
    const query = container.query("select * where timestamp > TIMESTAMPADD(HOUR, NOW(), -1)");
    const rowset = await query.fetch();
    const data = [];
    while (rowset.hasNext()) {
      data.push(rowset.next());
    }
    return data;
  } catch(err) {
    console.log(err);
  }
}

const dropContainer = (store, containerName) =>  async function () {
  await store.dropContainer(containerName);
}

const createContainer = async (store) => {
  const containerName = "FreeMemoryPercentage";
  let container = await store.getContainer(containerName);
  if (container === null) {
    try {
      const schema = new griddb.ContainerInfo({
        name: containerName,
        columnInfoList: [
          ["timestamp", griddb.Type.TIMESTAMP],
          ["freeMemPercentage", griddb.Type.DOUBLE]
        ],
        type: griddb.ContainerType.TIME_SERIES,
        rowKey: true
      });
      container = await store.putContainer(schema, false);
    } catch (err) {
      console.log(err);
    }
  }
  return {
    putRow: putRow(container),
    getLatestRows: getLatestRows(container),
    dropContainer: dropContainer(store, containerName)
  }
}

const connect = async () => {
  const factory = griddb.StoreFactory.getInstance();
  const store = factory.getStore({
    "notificationMember": "griddb:10001",
    "clusterName": "defaultCluster",
    "username": "admin",
    "password": "admin"
  });
  return createContainer(store);
};

module.exports = { connect };
