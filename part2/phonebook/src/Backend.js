import axios from "axios";

const baseUrl = "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

// const update = ()=>{
//     const request = axios.put
// }

const add = (obj) => {
  const request = axios.post(baseUrl, obj);

  return request
    .then((response) => response.data)
    .catch((err) => {
      return { error: err };
    });
};

const update = (obj) => {
  const request = axios.put(`${baseUrl}/${obj.id}`, obj);
  return request.then((response) => response.data);
};

const remove = (obj) => {
  const request = axios.delete(`${baseUrl}/${obj.id}`);
  return request.then((response) => response.data);
};

export default { getAll, add, remove, update };
